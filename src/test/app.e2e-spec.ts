/** @format */

import supertest from 'supertest';
import App from '../index';

const request = supertest(App);

describe('Test e2e messages-App', () => {
  describe('Get Messages', () => {
    it('Success', async () => {
      let response = await request.get('/message').send({
      });
        console.log(response);
        
        expect(response.status).toBe(200)
    });
  });
});
