import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AtmModule } from './../src/atm.module';
import { WalletService } from '../src/wallet/wallet.service';
import { BankingService } from '../src/banking/banking.service';
import { BankingType } from '../src/enum/BankingType';

describe('AtmController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AtmModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/wallet/:walletId (GET) not UUID', () => {
    return request(app.getHttpServer()).get('/wallet/NotUUID').expect(400);
  });

  it('/wallet/:walletId (GET) no data', () => {
    return request(app.getHttpServer())
      .get('/wallet/e1ca1f88-29d3-496a-8614-8d99524b51e5')
      .expect(404);
  });

  it('/wallet/:walletId (GET)', async () => {
    const service = app.get<WalletService>(WalletService);
    const wallet = await service.save(0);
    return request(app.getHttpServer())
      .get(`/wallet/${wallet.walletId}`)
      .expect(200);
  });

  it('/wallet/:walletId (POST) invalid balance', () => {
    return request(app.getHttpServer())
      .post('/wallet')
      .send({ balance: -1 })
      .expect(400);
  });

  it('/wallet/:walletId (POST)', () => {
    return request(app.getHttpServer())
      .post('/wallet')
      .send({ balance: 0 })
      .expect(201);
  });

  it('/banking (POST) invalid paramter1', () => {
    return request(app.getHttpServer())
      .post('/banking')
      .send({
        walletId: 'e1ca1f88-29d3-496a-8614-8d99524b51e5',
        bankingType: 'DEPOSIT',
        amount: 0,
      })
      .expect(400);
  });

  it('/banking (POST) invalid paramter2', () => {
    return request(app.getHttpServer())
      .post('/banking')
      .send({
        walletId: 'e1ca1f88-29d3-496a-8614-8d99524b51e5',
        bankingType: 'DEPOSI',
        amount: 10,
      })
      .expect(400);
  });

  it('/banking (POST)', async () => {
    const service = app.get<WalletService>(WalletService);
    const wallet = await service.save(0);
    return request(app.getHttpServer())
      .post('/banking')
      .send({
        walletId: wallet.walletId,
        bankingType: 'DEPOSIT',
        amount: 10,
      })
      .expect(201);
  });

  it('/banking/batch (PUT)', async () => {
    const wService = app.get<WalletService>(WalletService);
    const bService = app.get<BankingService>(BankingService);
    const wallet = await wService.save(0);
    await bService.save({
      walletId: wallet.walletId,
      bankingType: BankingType.DEPOSIT,
      amount: 1000,
    });
    return request(app.getHttpServer()).put('/banking/batch').expect(200);
  });
});
