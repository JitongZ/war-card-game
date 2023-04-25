

test.skip('this test is currently disabled', () => {
  const request = require('supertest');
  const app = require('../../config/express');    
  // test a simple get request to the root url
  describe('GET /', () => {
    test('it should return a 200 status code', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
    });
  });
    
  // Other tests similar to controller.test, but using the app and db
  // More tests should be added in the future
});



  