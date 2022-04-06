import { getExampleAndDesiredEnvPaths } from '../../helpers/getExampleAndDesiredEnvPaths.mjs';
import { ENVS_PATHS } from '../../constants/envsToSetup.mjs';
import getProjectRoot from '../../helpers/getProjectRoot.mjs';

const launchSetupEnvsStep = () => {
  console.log('1. Copying env examples');

  ENVS_PATHS.forEach(setupEnvs);
};

const setupEnvs = envPath => {
  const { exampleEnvPath, desiredEnvPath } = getExampleAndDesiredEnvPaths(envPath, getProjectRoot());
  console.log(`- Setting up '${envPath}'\n\t${exampleEnvPath}`);
  if (!fs.pathExistsSync(exampleEnvPath)) {
    console.warn('⚠ Example env does not exist');
    return;
  }
  if (fs.pathExistsSync(desiredEnvPath)) {
    console.log('✅  Already created .env');
    return;
  }
  fs.copySync(exampleEnvPath, desiredEnvPath);
  console.log(`✅  Created '${desiredEnvPath}'`);
  console.log(`ℹ  Please fill the above .env file(s) with the required configuration`);
};

export default launchSetupEnvsStep;
