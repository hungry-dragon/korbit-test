import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive, IsUUID, Min } from 'class-validator';
import { BankingType } from '../enum/BankingType';
import { Transform } from 'class-transformer';

export class PostBankingCommand {
  @ApiProperty({
    required: true,
    example: 'e1ca1f88-29d3-496a-8614-8d99524b51e5',
    description: 'wallet id',
  })
  @IsUUID()
  walletId: string;

  @ApiProperty({
    required: true,
    example: BankingType.DEPOSIT,
    description: 'banking type',
  })
  @IsEnum(BankingType)
  bankingType: BankingType;

  @ApiProperty({
    required: true,
    example: 100,
    description: 'amount gt 0 & lte balance for withdrawing',
  })
  @IsInt()
  @Min(0)
  amount: number;
}

export class GetBankingCommand {
  @ApiProperty({
    required: true,
    example: 'e1ca1f88-29d3-496a-8614-8d99524b51e5',
    description: 'wallet id',
  })
  @IsUUID()
  walletId: string;

  @ApiProperty({
    required: true,
    example: 100,
    description: 'size',
  })
  @Transform((x) => parseInt(x.value))
  @IsInt()
  @IsPositive()
  size: number;

  @ApiProperty({
    required: true,
    example: 123,
    description: 'last banking id',
  })
  @Transform((x) => parseInt(x.value))
  @IsInt()
  lastBankingId: number;
}
