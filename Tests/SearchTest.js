import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/Api/Search';
  const params = {
    query: {
      query: 'algorithm',
    },
  };

  const res = http.get(url, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}