import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenizedBallot.json';

@Injectable()
export class AppService {
  private publicClient;
  private walletClient;
  private account;

  constructor(private configService: ConfigService) {
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    if (!privateKey) throw new Error('PRIVATE_KEY missing from .env');

    this.account = privateKeyToAccount(`0x${privateKey}`);

    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: sepolia,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
    });
  }

  getContractAddress(): string {
    return this.configService.get<string>('TOKEN_ADDRESS') ?? '';
  }

  async getTokenName(): Promise<string> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'name',
    });
    return name as string;
  }

  async mintAndPrepare(address: `0x${string}`): Promise<string> {
    const TOKEN = this.configService.get<string>('TOKEN_ADDRESS')! as `0x${string}`;
    const BALLOT = this.configService.get<string>('BALLOT_ADDRESS')! as `0x${string}`;

    const token = getContract({
      address: TOKEN,
      abi: tokenJson.abi,
      client: this.walletClient,
    }) as any;

    const mintHash = await token.write.mint([address, 1n * 10n ** 18n], {
      account: this.account,
    });
    await this.publicClient.waitForTransactionReceipt({ hash: mintHash });

    const delegateHash = await token.write.delegate([address], {
      account: this.account,
    });
    await this.publicClient.waitForTransactionReceipt({ hash: delegateHash });

    // ⏳ Add delay to ensure delegation is indexed
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const ballot = getContract({
      address: BALLOT,
      abi: ballotJson.abi,
      client: this.walletClient,
    }) as any;

    const rightsHash = await ballot.write.giveRightToVote([address], {
      account: this.account,
    });
    await this.publicClient.waitForTransactionReceipt({ hash: rightsHash });

    return `✅ Voter ${address} prepared: mint (${mintHash}), delegate (${delegateHash}), right (${rightsHash})`;
  }
}
