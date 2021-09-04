import request from 'supertest';
import { app } from '../../app';

it('delete metadata',async () => {
    const body = {
        fileName: 'image.jpg',
        url: 'https://example.com',
        title: 'some title',
        alt: 'some alt'
    };

    // @ts-ignore
    const user = await global.signin();

    const { body: metaCreated } = await request(app)
        .post('/api/meta')
        .set('Cookie', user)
        .send(body)
        .expect(201);

    await request(app)
        .get(`/api/meta/${metaCreated.id}`)
        .set('Cookie', user)
        .send(body)
        .expect(200);

    await request(app)
        .delete(`/api/meta/${metaCreated.id}`)
        .set('Cookie', user)
        .expect(204);

    await request(app)
        .get(`/api/meta/${metaCreated.id}`)
        .set('Cookie', user)
        .send(body)
        .expect(404);
});
