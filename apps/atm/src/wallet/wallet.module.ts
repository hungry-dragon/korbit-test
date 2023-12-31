import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntiry } from '../entity/Wallet.entity';
import { BankingEntity } from '../entity/Banking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntiry, BankingEntity])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
