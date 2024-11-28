import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('End-to-end Testing', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          // You can specify a custom .env file for testing if needed
          // envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('TEST_POSTGRES_DB_HOST'),
            port: configService.get('TEST_POSTGRES_DB_PORT'),
            username: configService.get('TEST_POSTGRES_DB_USER'),
            password: configService.get('TEST_POSTGRES_DB_PASS'),
            database: configService.get('TEST_POSTGRES_DB_NAME'),
            entities: ['dist/**/*.entity{.ts}'],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  let token: string;
  let uuid: string;
  describe('Accounts', () => {
    it('should create a new user (/accounts/create)', async () => {
      const res = await request(app.getHttpServer())
        .post('/accounts/create')
        .send({
          email: 'test@test4545.fr',
          password: 'testTEST123',
          firstname: 'test',
          lastname: 'test',
          phone: '+33600000000',
        })
        .expect(201);
      expect(res.body.newAccount).toHaveProperty('uuid');
      uuid = res.body.newAccount.uuid;
      return 1;
    });
    it('should log the user and return a token (/login)', async () => {
      const requestResult = await request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'test@test4545.fr',
          password: 'testTEST123',
        })
        .expect(200);
      expect(requestResult.body).toHaveProperty('token');
      token = requestResult.body.token;
    });
  });

  let forumId: number;
  describe('Forums', () => {
    it('should create a new forum (/forum/create)', async () => {
      const res = await request(app.getHttpServer())
        .post('/forum/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'test',
          description: 'test',
          img_url: 'https://test.test.ts/blabla.png',
          is_archived: false,
        })
        .expect(201);
      expect(res.body).toHaveProperty('id');
      forumId = res.body.id;
    });

    it('should get all forums (/forum)', async () => {
      const res = await request(app.getHttpServer()).get('/forum').expect(200);
      expect(
        res.body instanceof Object && res.body.items instanceof Array,
      ).toBeTruthy();
      expect(res.body.items.length).toBe(res.body.totalItems);
    });

    it('should get the forum by id (/forum?filter=id:eq:id)', async () => {
      return await request(app.getHttpServer())
        .get('/forum?filter=id:eq:' + forumId)
        .expect(200);
    });

    it('should update the forum /forum/update/:id)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/forum/update/' + forumId)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'test2',
          description: 'test2',
          img_url: 'https://test2.test.ts/blabla.png',
          is_archived: false,
        });
      expect(res.body.title).toBe('test2');
      expect(res.body.description).toBe('test2');
      expect(res.body.img_url).toBe('https://test2.test.ts/blabla.png');
    });

    it('should archive the forum (/forum/archive/:id)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/forum/archive/' + forumId)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.is_archived).toBe(true);
    });
  });

  describe('Accounts (cleaning)', () => {
    it('should delete the user /accounts/delete/uuid/:uuid)', async () => {
      return await request(app.getHttpServer())
        .delete('/accounts/delete/uuid/' + uuid)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Forums (cleaning)', () => {
    it('should delete the forum (/forum/delete/:id', async () => {
      return await request(app.getHttpServer())
        .delete('/forum/delete/' + forumId)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
