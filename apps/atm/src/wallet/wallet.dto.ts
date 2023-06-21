import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PostWalletCommand {
  @ApiProperty({
    required: true,
    example: 0,
    description: '초기잔액 gte 0',
  })
  @IsInt()
  @Min(0)
  balance: number;
}

export class WalletDto {
  @ApiResponseProperty({ example: 'uuid' })
  walletId: string;

  @ApiResponseProperty({ example: 100 })
  balance: number;

  @ApiResponseProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiResponseProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiResponseProperty({ example: -100 })
  notReflectedAmount: number;
}
