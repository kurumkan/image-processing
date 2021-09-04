import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if meta not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/meta/${id}`)
        .send()
        .expect(404);
});

it('returns meta', async () => {
    const title = 'some title';
    const alt = 'some alt';
    const url = 'https://example.com';
    const fileName = 'iamge.jpeg';

    const response = await request(app)
        .post('/api/meta')
        // @ts-ignore
        .set('Cookie', global.signin())
        .send({ title, url, alt, fileName })
        .expect(201);

    const metaResponse = await request(app)
        .get(`/api/meta/${response.body.id}`)
        .send()
        .expect(200);

    expect(metaResponse.body.title).toEqual(title);
    expect(metaResponse.body.url).toEqual(url);
    expect(metaResponse.body.alt).toEqual(alt);
});