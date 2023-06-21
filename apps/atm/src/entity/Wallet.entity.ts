import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'wallet' })
export class WalletEntiry {
  @ApiResponseProperty({ example: 'uuid' })
  @PrimaryColumn({ name: 'wallet_id', type: 'varchar', length: 36 })
  walletId: string;

  @ApiResponseProperty({ example: 100 })
  @Column({ type: 'int' })
  balance: number;

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
