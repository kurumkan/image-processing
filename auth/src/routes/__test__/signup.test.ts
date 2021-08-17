import request from 'supertest';
import { app } from '../../app';

it('returns 201 on successful signup', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns 400 with invalid email', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'somestring',
      password: 'password'
    })
    .expect(400);
});

it('returns 400 with invalid password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'example@example.com',
      password: 'a'
    })
    .expect(400);
});

it('returns 400 with missing email and password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);
});

it('disalows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'example@example.com',
      password: 'password'
    })
    .expect(201); 
  
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'example@example.com',
      password: 'password'
    })
    .expect(400);   
});

it('sets cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'example@example.com',
      password: 'password'
    })
    .expect(201); 

  expect(response.get('Set-Cookie')).toBeDefined();  
})