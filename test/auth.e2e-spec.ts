import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    app.close();
  });

  it('handles a signup request', () => {
    const userEmail = 'asdffsff@asdf.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: '12345' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(userEmail);
      });
  });

  it('signup as a new user then get currently logged in user', async () => {
    const user = { email: 'asdffsff@asdf.com', password: '12345' };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: user.email, password: user.password })
      .expect(201);

    const cookie = res.get('Set-cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(user.email);
  });
});
