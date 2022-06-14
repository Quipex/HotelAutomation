import { promisify } from 'util';

async function sleep(ms: number): Promise<any> {
  return promisify(setTimeout)(ms);
}

export { sleep };
