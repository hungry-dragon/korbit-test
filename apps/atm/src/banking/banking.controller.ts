import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BankingEntity } from '../entity/Banking.entity';
import { GetBankingCommand, PostBankingCommand } from './bankng.dto';
import { BankingService } from './banking.service';

@ApiTags('banking')
@Controller({ path: 'banking', version: '1' })
export class BankingController {
  constructor(private bankingService: BankingService) {}

  @ApiOperation({
    summary: 'get banking list',
  })
  @ApiResponse({
    status: 200,
    description: 'return banking list',
    type: [BankingEntity],
  })
  @Get()
  getBanking(@Query() command: GetBankingCommand) {
    return this.bankingService.find(
      command.walletId,
      command.size,
      command.lastBankingId,
    );
  }
  @ApiOperation({
    summary: 'create banking job',
  })
  @ApiResponse({
    status: 201,
    description: 'return banking item',
    type: BankingEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'check validation',
  })
  @Post()
  async postBanking(@Body() bankingCommand: PostBankingCommand) {
    const result = await this.bankingService.save(bankingCommand);
    if (result.error) {
      throw new BadRequestException(result.error);
    }
    return result.banking;
  }

  @ApiOperation({
    summary: 'batch banking job',
  })
  @ApiResponse({
    status: 200,
    description: 'return batch count',
    type: Number,
  })
  @Put('batch')
  putBatchBanking() {
    return this.bankingService.batchComplete();
  }
}
