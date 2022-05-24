import { app } from '../src/server';

beforeAll(async () => {
});

afterAll(async () => {
  return app.emit('close');
});
