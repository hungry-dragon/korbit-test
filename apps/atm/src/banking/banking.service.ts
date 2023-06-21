import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { BankingEntity } from '../entity/Banking.entity';
import { PostBankingCommand } from './bankng.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BankingType } from '../enum/BankingType';
import { WalletEntiry } from '../entity/Wallet.entity';
import { BankingStatus } from '../enum/BankingStatus';

@Injectable()
export class BankingService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(BankingEntity)
    private readonly bankingRepository: Repository<BankingEntity>,
    @InjectRepository(WalletEntiry)
    private readonly walletRepository: Repository<WalletEntiry>,
  ) {}

  public find(walletId: string, size: number, lastBankingId: number) {
    return this.bankingRepository
      .createQueryBuilder('b')
      .where({ walletId })
      .andWhere({ bankingId: MoreThan(lastBankingId) })
      .orderBy('b.bankingId', 'ASC')
      .take(size)
      .getMany();
  }

  public async save({
    walletId,
    bankingType,
    amount,
  }: PostBankingCommand): Promise<{
    error?: string;
    banking?: BankingEntity;
  }> {
    const qr = this.dataSource.createQueryRunner();
    try {
      await qr.startTransaction();
      const repo = qr.manager.withRepository(this.bankingRepository);
      // check inprogress
      const isInprogress = await repo.exist({
        where: {
          walletId,
          bankingStatus: BankingStatus.IN_PROGRESS,
        },
      });

      if (isInprogress) {
        throw 'inprogress';
      }

      // check wallet
      const wallet = await qr.manager
        .withRepository(this.walletRepository)
        .findOne({ where: { walletId }, select: ['balance'] });
      if (!wallet) {
        throw 'no wallet';
      }

      // check balance
      if (bankingType == BankingType.WITHDRAW && wallet.balance < amount) {
        throw 'bigger than balance';
      }
      const banking = await repo.save({
        walletId,
        bankingStatus: BankingStatus.IN_PROGRESS,
        bankingType,
        amount,
      });

      await qr.commitTransaction();
      return { banking };
    } catch (e) {
      await qr.rollbackTransaction();
      return { error: e };
    } finally {
      await qr.release();
    }
  }

  public async batchComplete() {
    const bankings = await this.bankingRepository
      .createQueryBuilder('b')
      .where({ bankingStatus: BankingStatus.IN_PROGRESS })
      .orderBy('b.walletId', 'ASC')
      .addOrderBy('b.bankingId', 'DESC')
      .getMany();
    const result = { complete: 0, cancel: 0 };
    const qr = this.dataSource.createQueryRunner();
    for (const banking of bankings) {
      try {
        await qr.startTransaction();
        const wallet = await qr.manager
          .withRepository(this.walletRepository)
          .findOneBy({ walletId: banking.walletId });

        if (
          banking.bankingType == BankingType.WITHDRAW &&
          banking.amount > wallet.balance
        ) {
          result.cancel++;
          banking.bankingStatus = BankingStatus.CANCEL;
        } else {
          result.complete++;
          banking.bankingStatus = BankingStatus.COMPLETE;

          wallet.balance =
            banking.bankingType == BankingType.WITHDRAW
              ? wallet.balance - banking.amount
              : wallet.balance + banking.amount;
          await qr.manager.withRepository(this.walletRepository).save(wallet);
        }
        await qr.manager.withRepository(this.bankingRepository).save(banking);
        await qr.commitTransaction();
      } catch (e) {
        await qr.rollbackTransaction();
      }
    }
    if (qr) {
      qr.release();
    }
    return result;
  }
}
