import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTagDto } from '../src/tag/dto/create-tag.dto';

const tag: CreateTagDto = {
  name: 'testTag',
};

describe('TagController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/tag (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/tag')
      .send(tag)
      .expect(200)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expect(createdId).toBeDefined();
      });
  });
});
