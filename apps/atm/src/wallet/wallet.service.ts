import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WalletEntiry } from '../entity/Wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntiry)
    private readonly wallerRepository: Repository<WalletEntiry>,
  ) {}

  public findOne(walletId: string) {
    return this.wallerRepository.findOneBy({ walletId });
  }

  public save(balance: number) {
    return this.wallerRepository.save(
      this.wallerRepository.create({
        walletId: uuidV4(),
        balance,
      }),
    );
  }
}
