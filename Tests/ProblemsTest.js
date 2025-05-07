import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/Api/Problems';
  const payload = JSON.stringify({
    title: 'Sample Problem',
    description: 'This is a sample problem description.',
    difficulty: 'Easy',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(1);
}