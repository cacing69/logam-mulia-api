import request from 'supertest';
import app from '../../../src/app';

export async function loginAndGetToken() {
    const response = await request(app.callback()).post('/auth/token').send({
        email: 'developer@email.com',
        password: 'password^'
    });

    return response.body.data.token;
}