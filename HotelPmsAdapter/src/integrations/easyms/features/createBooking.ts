import { log } from '~/config/logger';
import { CloudProvider } from '~/integrations/CloudProvider.interface';
import { generateEasyMsId } from '~/integrations/easyms/features/helpers';

const createBooking: CloudProvider['createBooking'] = async (payload) => {
  log.error('Not implemented', { args: [payload] });
  throw new Error('Not implemented yet');
  return Promise.resolve({ id: generateEasyMsId() });
};

export { createBooking };
