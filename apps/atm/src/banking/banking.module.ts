import { Module } from '@nestjs/common';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankingEntity } from '../entity/Banking.entity';
import { WalletEntiry } from '../entity/Wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankingEntity, WalletEntiry])],
  controllers: [BankingController],
  providers: [BankingService],
})
export class BankingModule {}
