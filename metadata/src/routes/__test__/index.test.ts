import request from 'supertest';
import { app } from '../../app';

const createMeta = (user: [string]) => {
    const url = 'https://example.com';
    const title = 'some title';
    const alt = 'some alt';
    const fileName = 'image.jpg';

    return request(app)
        .post('/api/meta')
        .set('Cookie', user)
        .send({ url, title, alt, fileName })
        .expect(201);
};

it('can fetch metadata items', async () => {
    // @ts-ignore
    const user = global.signin();
    await createMeta(user);
    await createMeta(user);
    await createMeta(user);

    const response = await request(app)
        .get(`/api/meta`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});