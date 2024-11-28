import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('End-to-end Testing', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('Forums', () => {
    it('/forum (GET)', async () => {
      return await request(app.getHttpServer()).get('/forums').expect(200);
    });
    it('/forum (GET)', async () => {
      return await request(app.getHttpServer()).get('/forums').expect(200);
    });
    it('/forum (GET)', async () => {
      return await request(app.getHttpServer()).get('/forums').expect(200);
    });
    it('/forum (GET)', async () => {
      return await request(app.getHttpServer()).get('/forums').expect(200);
    });
  });
  describe('Account', () => {
    it('/account (GET)', async () => {
      return await request(app.getHttpServer())
        .post('/accounts/create')
        .expect(200);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
