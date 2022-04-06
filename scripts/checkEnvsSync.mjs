#!/usr/bin/env zx
import 'zx/globals';
import readEnv from './helpers/readEnv.mjs';
import { ENVS_PATHS } from './constants/envsToSetup.mjs';
import { getExampleAndDesiredEnvPaths } from './helpers/getExampleAndDesiredEnvPaths.mjs';
import getProjectRoot from './helpers/getProjectRoot.mjs';

const compareExampleAndDesiredKeys = (envPath) => {
  console.log(`- Checking envs at '${envPath}'`);
  const { exampleEnvPath, desiredEnvPath } = getExampleAndDesiredEnvPaths(envPath, getProjectRoot());
  const desiredEnvMaps = readEnv(desiredEnvPath);
  const exampleEnvMaps = readEnv(exampleEnvPath);
  if (desiredEnvMaps.length !== exampleEnvMaps.length) {
    console.warn(`Different number of env files (.env: ${desiredEnvMaps.length}, .env.example: ${exampleEnvMaps.length})\n\t@ ${envPath}`);
    return;
  }
  exampleEnvMaps.forEach((exampleEnvMap, index) => {
    compareEnvMaps(desiredEnvMaps[index], exampleEnvMap);
  });
};

const compareEnvMaps = (desiredEnv, exampleEnv) => {
  const { path: desiredEnvPath, map: desiredEnvMap } = desiredEnv;
  const { path: exampleEnvPath, map: exampleEnvMap } = exampleEnv;
  const desiredEnvKeys = Object.keys(desiredEnvMap);
  const exampleEnvKeys = Object.keys(exampleEnvMap);
  const extraDesiredEnvKeys = desiredEnvKeys.filter(k => !exampleEnvKeys.includes(k));
  const extraExampleEnvKeys = exampleEnvKeys.filter(k => !desiredEnvKeys.includes(k));
  if (extraDesiredEnvKeys.length) {
    console.warn(`⚠  ${desiredEnvPath} has ${extraDesiredEnvKeys.length} more env keys than it's example.`);
    console.warn(`\tKeys are: ${extraDesiredEnvKeys}`);
  }
  if (extraExampleEnvKeys.length) {
    console.warn(`⚠  ${exampleEnvPath} has ${extraExampleEnvKeys.length} more env keys than it's corresponding .env file.`);
    console.warn(`\tKeys are: ${extraExampleEnvKeys}`);
  }
  if (extraExampleEnvKeys.length === 0 && extraDesiredEnvKeys.length === 0) {
    console.log(`✅  Envs have same keys`);
  }
};

console.log('🔍 Searching for distinct keys in example and real envs.');

ENVS_PATHS.forEach(compareExampleAndDesiredKeys);
