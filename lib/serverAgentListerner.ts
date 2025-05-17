// lib/serverAgentListener.ts
import { HCS10Client } from '@hashgraphonline/standards-agent-kit'
import { FeeConfigBuilder, Logger } from '@hashgraphonline/standards-sdk';
import { fileURLToPath } from 'url';
import axios from 'axios';

// import dotenv from 'dotenv';
// dotenv.config({ path: '.env.local' });

import {
  Client,
} from "@hashgraph/sdk";

const SECONDAGENT_ACCOUNT_ID      = process.env.SECONDAGENT_ACCOUNT_ID!;
const SECONDAGENT_PRIVATE_KEY     = process.env.SECONDAGENT_PRIVATE_KEY!;
const SECONDAGENT_INBOUND_TOPIC_ID= process.env.SECONDAGENT_INBOUND_TOPIC_ID!;
const FIRSTAGENT_ACCOUNT_ID       = process.env.FIRSTAGENT_ACCOUNT_ID!;
const HEDERA_NETWORK              = process.env.HEDERA_NETWORK!;

const CONNECTION_TOPIC_ID         = process.env.CONNECTION_TOPIC_ID ?? '0.0.6006045';

const BACKEND_URL = process.env.BACKEND_URL!;
export const api = axios.create({
  baseURL: `${BACKEND_URL}`,
  headers: { 'Content-Type': 'application/json' },
});

async function generateResponse(input: string, user_id:string, sessionId: string): Promise<string> {

  let ig_id: string;
  if (user_id === '') {
    ig_id = 'averiebishop'
  } else {
    ig_id = user_id
  }

  const { data } = await api.post(
    '/chat',
    {
      message: input,
      user_id: ig_id,
      assistant_id: '',
      session_id: sessionId,
      chat_history: [],
    },
    { responseType: 'text' }
  );
  console.log('asop', data); 
  return JSON.parse(data).toString();
}

export function parseStringOrJson(
  input: string
): any {
  const trimmed = input.trim();

  const looksLikeJson =
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'));

  if (!looksLikeJson) return input;

  try {
    return JSON.parse(trimmed);
  } catch {
    return input;
  }
}


async function listenAndServe() {
  const client = new HCS10Client(
    SECONDAGENT_ACCOUNT_ID,
    SECONDAGENT_PRIVATE_KEY,
    HEDERA_NETWORK === 'mainnet' ? 'mainnet' : 'testnet',
    { logLevel: 'info' }
  );
  console.log('[Agent-2] Connected as', client.getOperatorId());

  if (CONNECTION_TOPIC_ID.trim() === '0.0.6006045') {
    console.log('second_id:', SECONDAGENT_ACCOUNT_ID)
    console.log(`[Agent-2] Using preset connection topic ${CONNECTION_TOPIC_ID} – starting listener…`);
    _listenOnSharedTopic(client, CONNECTION_TOPIC_ID.trim()).catch(console.error);
    return; 
  }

  const feeConfig = new FeeConfigBuilder({network:HEDERA_NETWORK === 'mainnet' ? 'mainnet' : 'testnet', logger: new Logger}).addHbarFee(2, SECONDAGENT_ACCOUNT_ID);

  let lastSeenConnReqSeq = 0;

  while (true) {
    console.log('checking request..')
    const { messages } = await client.getMessages(SECONDAGENT_INBOUND_TOPIC_ID);
    const newReqs = messages.filter(
      m => m.op === 'connection_request' && m.sequence_number > lastSeenConnReqSeq
    );

    let newReq;

    if (newReqs.length === 0) {
      console.log('No request found');
    } else {
      newReq = newReqs.reduce((max, msg) =>
        msg.sequence_number > max.sequence_number ? msg : max,
        newReqs[0]
      );
    }

    if (newReq) {
      console.log(`[Agent-2] Incoming connection_request #${newReq.sequence_number}`);

      const resp = await client.handleConnectionRequest(
        SECONDAGENT_INBOUND_TOPIC_ID,
        FIRSTAGENT_ACCOUNT_ID,
        newReq.sequence_number,
        feeConfig
      );

      if (!resp.connectionTopicId) {
        console.error(`[Agent-2] Failed to accept req #${newReq.sequence_number}`);
        continue;
      }
      console.log(`[Agent-2] Connection established on topic ${resp.connectionTopicId}`);

      _listenOnSharedTopic(client, resp.connectionTopicId).catch(console.error);
      lastSeenConnReqSeq = newReq.sequence_number;
    }
    await _sleep(10000);
  }
}

const bClient = Client.forTestnet();
bClient.setOperator(SECONDAGENT_ACCOUNT_ID, SECONDAGENT_PRIVATE_KEY);


async function _listenOnSharedTopic(client: HCS10Client, topicId: string) {
  while (true) {
    console.log('Checking messsages...')
    const { messages } = await client.getMessages(topicId);
    let latest;

    if (messages.length === 0) {
    } else {
      latest = messages.reduce((max, msg) =>
        msg.sequence_number > max.sequence_number ? msg : max,
        messages[0]
      );
    }

    if (latest) {
      const msgTime  = Number(latest.timestamp);                     
      const now      = Date.now();   
      
      if (now - msgTime <= 20_000) {
        const raw_message = parseStringOrJson(latest.data);
        let reply;

        if (typeof raw_message === 'object') {
          reply = await generateResponse(raw_message.message, raw_message.ig_id, raw_message.sessionId)
        } else {
          if (!raw_message.message) {
              reply = ''
          } else {
              reply = await generateResponse(latest.data, '', '')
          }
        }
        if (reply !== '') {
          console.log('asop3', reply) 
          await client.sendMessage(topicId, reply, latest.m);
          console.log(`[Agent-2] Replied with: ${reply}`);
        }
      }
    }
    await _sleep(1000);
  }
}

function _sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

const scriptPath = process.argv[1];
const modulePath = fileURLToPath(import.meta.url);

if (scriptPath === modulePath) {
  listenAndServe().catch(err => {
    console.error('[Agent-2] Fatal error:', err);
    process.exit(1);
  });
}

export { listenAndServe };
