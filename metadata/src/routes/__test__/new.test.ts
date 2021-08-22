import request from 'supertest';
import { app } from '../../app';
import { Meta } from '../../models/meta';

it('has a route handler listening to /api/meta for post requests', async () => {
    const response = await request(app)
        .post('/api/meta')
        .send({});

    expect(response.status).not.toEqual(404);
});

it("requires user being logged in", async () => {
    await request(app)
        .post('/api/meta')
        .send({})
        .expect(401);
});

it('returns non-401 status if user signed in', async () => {
    const response = await request(app)
        .post('/api/meta')
        // @ts-ignore
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns error if invalid missing inputs', async () => {
    // @ts-ignore
    const user = global.signin();

    await request(app)
        .post('/api/meta')
        .set('Cookie', user)
        .send({
            url: 'https://example.com',
            title: 'some title',
            alt: ''
        })
        .expect(400);

    await request(app)
        .post('/api/meta')
        .set('Cookie', user)
        .send({
            url: '',
            title: 'some title',
            alt: 'some alt'
        })
        .expect(400);
});

it('returns an error if invalid url is provided', async () => {
    await request(app)
        .post('/api/meta')
        // @ts-ignore
        .set('Cookie', global.signin())
        .send({
            url: 'not_a_url',
            title: 'some title',
            alt: 'some alt'
        })
        .expect(400);
});

it('creates a metadata item', async () => {
    let metadataItems = await Meta.find({});
    expect(metadataItems.length).toEqual(0);

    const url = 'https://exmaple.com';
    const title = 'some title';
    const alt = 'some alt'

    await request(app)
        .post('/api/meta')
        // @ts-ignore
        .set('Cookie', global.signin())
        .send({ title, url, alt })
        .expect(201);

    metadataItems = await Meta.find({});
    expect(metadataItems.length).toEqual(1);
    expect(metadataItems[0].title).toEqual(title);
    expect(metadataItems[0].url).toEqual(url);
    expect(metadataItems[0].alt).toEqual(alt);
});
