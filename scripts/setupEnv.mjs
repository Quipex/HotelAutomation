#!/usr/bin/env zx
import 'zx/globals';
import { ENVS_PATHS } from "./constants/envsToSetup.mjs";
import { getExampleAndDesiredEnvPaths } from "./helpers/getExampleAndDesiredEnvPaths.mjs";
import getProjectRoot from "./helpers/getProjectRoot.mjs";

const setupEnvs = envPath => {
  const { exampleEnvPath, desiredEnvPath } = getExampleAndDesiredEnvPaths(envPath, getProjectRoot());
  console.log(
    `\n- Setting up '${envPath}':` +
    `\n\t${exampleEnvPath}`
  );
  if (!fs.pathExistsSync(exampleEnvPath)) {
    console.warn('\t❗ Example env does not exist');
    return;
  }
  if (fs.pathExistsSync(desiredEnvPath)) {
    console.log('\t✅  Already created .env');
    return;
  }
  fs.copySync(exampleEnvPath, desiredEnvPath);
  console.log(`\t✅  Created '${desiredEnvPath}'`);
  console.log(`\tℹ  Please fill the above .env file(s) with the required configuration`);
};

console.log('⚒ Setting up envs ⚒');
ENVS_PATHS.forEach(setupEnvs);
