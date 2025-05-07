import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/Api/LeaderBoard';
  const res = http.get(url);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}

const request = require('supertest');
const { handler } = require('../client/src/app/Api/LeaderBoard/route');

describe('LeaderBoard API', () => {
  it('should handle a valid GET request', async () => {
    const res = await request('http://localhost:3000/Api/LeaderBoard').get('/');
    expect(res.statusCode).toBe(200);
  });
});