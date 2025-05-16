// lib/clientAgent.ts
import { HCS10Client } from '@hashgraphonline/standards-agent-kit';
import { Client, TopicMessageSubmitTransaction } from "@hashgraph/sdk";


const FIRSTAGENT_ACCOUNT_ID = process.env.NEXT_PUBLIC_FIRSTAGENT_ACCOUNT_ID!;
const FIRSTAGENT_PRIVATE_KEY = process.env.NEXT_PUBLIC_FIRSTAGENT_PRIVATE_KEY!;
const SECONDAGENT_INBOUND_TOPIC_ID = process.env.NEXT_PUBLIC_SECONDAGENT_INBOUND_TOPIC_ID!;
const HEDERA_NETWORK = process.env.HEDERA_NETWORK;

export interface SendAndReceiveResult {
  res: string;
  feeSent: string;   
  feeReceived: string; 
  topic: string;
}

const bClient = Client.forTestnet();
bClient.setOperator(FIRSTAGENT_ACCOUNT_ID, FIRSTAGENT_PRIVATE_KEY);

class AgentService {
  private client: HCS10Client;
  private connectionTopicId: string | null = null;
  private initializing: Promise<void> | null = null;

  constructor() {
    this.client = new HCS10Client(
      FIRSTAGENT_ACCOUNT_ID,
      FIRSTAGENT_PRIVATE_KEY,
      HEDERA_NETWORK === 'mainnet' ? 'mainnet' : 'testnet',
      { logLevel: 'info' }
    );
  }

  private async submitWithFee(topic: string, msg: string): Promise<string> {
    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(topic)
      .setMessage(msg)
      .execute(bClient);
    const record = await tx.getRecord(bClient);
    return record.transactionFee.toString();
  }

  private async initConnection() {
    if (this.initializing) {
      return this.initializing;
    }
    this.initializing = (async () => {
      const receipt = await this.client.submitConnectionRequest(
        SECONDAGENT_INBOUND_TOPIC_ID,
        'ConnectionRequest'
      );
      const seq = receipt.topicSequenceNumber?.toNumber();
      if (seq == null) {
        throw new Error('No sequence in receipt');
      }

      const confirmation = await this.client.waitForConnectionConfirmation(
        SECONDAGENT_INBOUND_TOPIC_ID,
        seq,
        15,
        3000
      );
      if (!confirmation.connectionTopicId) {
        throw new Error('Connection confirmation failed');
      }
      this.connectionTopicId = confirmation.connectionTopicId;
    })();
    return this.initializing;
  }

  public async sendAndReceive(message: string, ig_id: string, sessionId: string): Promise<SendAndReceiveResult> {

    if (!this.connectionTopicId) {
      console.log('init')
      await this.initConnection();
    }
    const topic = this.connectionTopicId!;

    const payload = {
      message: message,
      ig_id: ig_id,
      sessionId: sessionId
    };
    
    const jsonMessage = JSON.stringify(payload);

    const randomCode = crypto.randomUUID().slice(0, 8);
    await this.client.sendMessage(topic, jsonMessage, `code:${randomCode}`);

    while (true) {
      const { messages } = await this.client.getMessages(topic);
      let latest;

      if (messages.length === 0) {
        console.log('No messages found');
      } else {
        latest = messages.reduce((max, msg) =>
          msg.sequence_number > max.sequence_number ? msg : max,
          messages[0]
        );
      }

      if (latest && latest.data !== jsonMessage && latest.m ===`code:${randomCode}`) {
        console.log('asdop',latest)

        let latestData: string;
        latestData = latest.data;
        // const [feeSent, feeReceived] = await Promise.all([
        //   this.submitWithFee(topic, jsonMessage),
        //   this.submitWithFee(topic, latestData),
        // ])

        // dummy data
        const feeSent = '0.0004678'
        const feeReceived = '0.0003238'

        return {
          res:    latestData,
          feeSent,
          feeReceived,
          topic,
        };
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

export const agentService = new AgentService();
