import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WalletEntiry } from '../entity/Wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidV4 } from 'uuid';
import { BankingEntity } from '../entity/Banking.entity';
import { BankingStatus } from '../enum/BankingStatus';
import { WalletDto } from './wallet.dto';
import { BankingType } from '../enum/BankingType';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntiry)
    private readonly wallerRepository: Repository<WalletEntiry>,
    @InjectRepository(BankingEntity)
    private readonly bankingRepository: Repository<BankingEntity>,
  ) {}

  public async findOne(walletId: string): Promise<WalletDto> {
    const wallet = await this.wallerRepository.findOneBy({ walletId });
    if (!wallet) {
      return null;
    }
    const bankings = await this.bankingRepository.find({
      where: {
        walletId,
        bankingStatus: BankingStatus.IN_PROGRESS,
      },
      select: ['amount', 'bankingType'],
    });
    return {
      ...wallet,
      notReflectedAmount: bankings.reduce((acc, x) => {
        return (
          acc + (x.bankingType === BankingType.DEPOSIT ? x.amount : -x.amount)
        );
      }, 0),
    };
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
