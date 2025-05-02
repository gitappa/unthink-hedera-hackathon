// lib/hcsClient.ts
import { HCS10Client } from '@hashgraphonline/standards-sdk';
import dotenv from 'dotenv';

dotenv.config();

export const hcsClient = new HCS10Client({
  network: 'testnet',
  operatorId: '0.0.5877434',
  operatorPrivateKey: '3030020100300706052b8104000a04220420bf022fba182f78e1c7645c2c13f3aabcc566f106071ca7fb3840f85480d95f83',
  feeAmount: 3,
  prettyPrint: false
});
