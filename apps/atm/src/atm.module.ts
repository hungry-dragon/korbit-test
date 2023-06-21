import { Module, ValidationPipe } from '@nestjs/common';
import { EnvConfigModule } from './env-config/env-config.module';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigService } from './env-config/env-config.service';
import { WalletModule } from './wallet/wallet.module';
import { APP_PIPE } from '@nestjs/core';
import { WalletEntiry } from './entity/Wallet.entity';
import { BankingModule } from './banking/banking.module';
import { BankingEntity } from './entity/Banking.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: async (envConfigService: EnvConfigService) => {
        return {
          ...envConfigService.database,
          entities: [WalletEntiry, BankingEntity],
        };
      },
    }),
    EnvConfigModule,
    HealthModule,
    WalletModule,
    BankingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AtmModule {}
