import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if meta not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/meta/${id}`)
        // @ts-ignore
        .set('Cookie', global.signin())
        .send({ title: 'some title' })
        .expect(404);
});

it('returns 401 if not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/meta/${id}`)
        .send({ title: 'some title' })
        .expect(401);
});


it('returns 401 if user is not the owner', async () => {
    const fileName = 'image.jpeg';
    const createRequest = await request(app)
        .post('/api/meta')
        // @ts-ignore
        .set('Cookie', global.signin())
        .send({
            title: 'some title',
            alt: 'some alt',
            url: 'https://example.com',
            fileName
        })
        .expect(201);

    await request(app)
        .put(`/api/meta/${fileName}`)
        // @ts-ignore
        .set('Cookie', global.signin())
        .send({ title: 'new title' })
        .expect(401);
});


it('returns 400 if invalid data', async () => {
    // @ts-ignore
    const cookie = global.signin();
    const fileName = 'image.jpeg';
    const createRequest = await request(app)
        .post('/api/meta')
        .set('Cookie', cookie)
        .send({
            title: 'some title',
            alt: 'some alt',
            url: 'https://example.com',
            fileName
        })
        .expect(201);

    await request(app)
        .put(`/api/meta/${fileName}`)
        .set('Cookie', cookie)
        .send({})
        .expect(400);

    await request(app)
        .put(`/api/meta/${createRequest.body.id}`)
        .set('Cookie', cookie)
        .send({ lowsrc: 'broken_url' })
        .expect(400);
});

it('updates meta', async () => {
    // @ts-ignore
    const cookie = global.signin();
    const fileName = 'image.jpeg';
    const createRequest = await request(app)
        .post('/api/meta')
        .set('Cookie', cookie)
        .send({
            title: 'some title',
            alt: 'some alt',
            url: 'https://example.com',
            fileName
        })
        .expect(201);

    await request(app)
        .put(`/api/meta/${fileName}`)
        .set('Cookie', cookie)
        .send({
            title: 'new_title',
            alt: 'new_alt',
            lowsrc: 'https://lowsrc.com'
        })
        .expect(200);

    const getRequest = await request(app)
        .get(`/api/meta/${createRequest.body.id}`)
        .set('Cookie', cookie)
        .send();

    expect(getRequest.status).toEqual(200);
    expect(getRequest.body.title).toEqual('new_title');
    expect(getRequest.body.alt).toEqual('new_alt');
    expect(getRequest.body.lowsrc).toEqual('https://lowsrc.com');
});
