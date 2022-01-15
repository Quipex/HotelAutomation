import util from 'util';

async function sleep(ms: number): Promise<any> {
  return util.promisify(setTimeout)(ms);
}

export { sleep };
