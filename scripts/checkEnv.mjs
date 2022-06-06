#!/usr/bin/env zx
import 'zx/globals';
import readEnv from './helpers/readEnv.mjs';
import { ENVS_PATHS } from './constants/envsToSetup.mjs';
import { getExampleAndDesiredEnvPaths } from './helpers/getExampleAndDesiredEnvPaths.mjs';
import getProjectRoot from './helpers/getProjectRoot.mjs';

const countUnsynchedEnvsNumber = (envPath) => {
  let unsyncedEnvs = 0;
  console.log(`\n- Checking envs at '${envPath}'`);
  const { exampleEnvPath, desiredEnvPath } = getExampleAndDesiredEnvPaths(envPath, getProjectRoot());
  const desiredEnvMaps = readEnv(desiredEnvPath);
  const exampleEnvMaps = readEnv(exampleEnvPath);
  if (desiredEnvMaps.length !== exampleEnvMaps.length) {
    console.warn(`\t❗ Different number of env files (.env: ${desiredEnvMaps.length}, .env.example: ${exampleEnvMaps.length})`);
    console.warn(`\t\t> ${envPath}`)
    return 1;
  }
  exampleEnvMaps.forEach((exampleEnvMap, index) => {
    const areSynced = areEnvMapsSynced(desiredEnvMaps[index], exampleEnvMap);
    if (!areSynced) {
      unsyncedEnvs++;
    }
  });
  return unsyncedEnvs;
};

const areEnvMapsSynced = (desiredEnv, exampleEnv) => {
  let areSynced = true;
  const { path: desiredEnvPath, map: desiredEnvMap } = desiredEnv;
  const { path: exampleEnvPath, map: exampleEnvMap } = exampleEnv;
  const desiredEnvKeys = Object.keys(desiredEnvMap);
  const exampleEnvKeys = Object.keys(exampleEnvMap);
  const extraDesiredEnvKeys = desiredEnvKeys.filter(k => !exampleEnvKeys.includes(k));
  const extraExampleEnvKeys = exampleEnvKeys.filter(k => !desiredEnvKeys.includes(k));
  if (extraDesiredEnvKeys.length) {
    console.warn(`\t❗ ${desiredEnvPath} has ${extraDesiredEnvKeys.length} more env keys than it's example.`);
    console.warn(`\t\tKeys are: ${extraDesiredEnvKeys}`);
    areSynced = false;
  }
  if (extraExampleEnvKeys.length) {
    console.warn(`\t❗ ${exampleEnvPath} has ${extraExampleEnvKeys.length} more env keys than it's corresponding .env file.`);
    console.warn(`\t\tKeys are: ${extraExampleEnvKeys}`);
    areSynced = false;
  }
  if (extraExampleEnvKeys.length === 0 && extraDesiredEnvKeys.length === 0) {
    console.log(`\t✅  Envs have same keys`);
  }
  return areSynced;
};

console.log('🔍 Searching for distinct keys in example and real envs.');

const unsynchedEnvs = ENVS_PATHS.reduce((unsynchedEnvs, path) => countUnsynchedEnvsNumber(path) + unsynchedEnvs, 0);
if (unsynchedEnvs) {
  throw new Error(`${unsynchedEnvs} .env file(s) need(s) to be synced`);
}
