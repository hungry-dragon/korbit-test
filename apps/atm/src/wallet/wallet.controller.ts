import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostWalletCommand } from './wallet.dto';
import { WalletService } from './wallet.service';
import { WalletEntiry } from '../entity/Wallet.entity';

@ApiTags('wallet')
@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @ApiOperation({
    summary: 'find a wallet',
  })
  @ApiResponse({
    status: 200,
    description: 'return a wallet',
    type: WalletEntiry,
  })
  @ApiResponse({
    status: 404,
    description: 'no data',
  })
  @ApiResponse({
    status: 400,
    description: 'check validation',
  })
  @ApiParam({
    name: 'walletId',
    example: 'e1ca1f88-29d3-496a-8614-8d99524b51e5',
    description: 'wallet id',
  })
  @Get(':walletId')
  async getWallet(@Param('walletId', ParseUUIDPipe) walletId: string) {
    const wallet = await this.walletService.findOne(walletId);
    if (wallet) {
      return this.walletService.findOne(walletId);
    }
    throw new NotFoundException('no data');
  }

  @ApiOperation({
    summary: 'create new wallet',
  })
  @ApiResponse({
    status: 201,
    description: 'return a created wallet',
    type: WalletEntiry,
  })
  @ApiResponse({
    status: 400,
    description: 'check validation',
  })
  @Post()
  postWallet(@Body() { balance }: PostWalletCommand) {
    return this.walletService.save(balance);
  }
}
