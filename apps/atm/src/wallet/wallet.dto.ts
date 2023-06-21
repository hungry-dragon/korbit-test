import { ApiProperty } from '@nestjs/swagger';
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
