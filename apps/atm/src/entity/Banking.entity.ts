import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BankingType } from '../enum/BankingType';
import { BankingStatus } from '../enum/BankingStatus';

@Entity({ name: 'banking' })
export class BankingEntity {
  @ApiResponseProperty({ example: 1234 })
  @PrimaryGeneratedColumn({ name: 'banking_id', type: 'int' })
  bankingId: number;

  @ApiResponseProperty({ example: 'uuid' })
  @Column({ name: 'wallet_id', type: 'varchar', length: 36 })
  walletId: string;

  @ApiResponseProperty({ example: 500 })
  @Column({ type: 'int' })
  amount: number;

  @ApiResponseProperty({ example: 'DEPOSIT, WITHDRAW' })
  @Column({ name: 'banking_type', type: 'varchar', length: 10 })
  bankingType: BankingType;

  @ApiResponseProperty({ example: 'IN_PROGRESS, COMPLETE, CANCEL' })
  @Column({ name: 'banking_status', type: 'varchar', length: 10 })
  bankingStatus: BankingStatus;

  @ApiResponseProperty({ example: '2023-01-01T00:00:00.000Z' })
  @CreateDateColumn({
    name: 'create_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiResponseProperty({ example: '2023-01-01T00:00:00.000Z' })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
