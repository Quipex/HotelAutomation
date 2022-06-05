import env from '~/config/env';
import { CloudProvider } from './CloudProvider.interface';
import { EasymsCloudProvider } from './easyms/EasymsCloudProvider';
import { PmsCloudProvider } from './pmscloud/PmsCloudProvider';

let provider;

switch (env.pmsProvider) {
  case 'EASY_MS': {
    provider = EasymsCloudProvider;
    break;
  }
  case 'PMS_CLOUD': {
    provider = PmsCloudProvider;
    break;
  }
  default: {
    throw new Error(`Incorrect provider name registered in .env : ${env.pmsProvider}`);
  }
}

const getCloudProvider: () => CloudProvider = () => {
  return provider;
};

export { getCloudProvider };
