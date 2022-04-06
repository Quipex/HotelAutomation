const getExampleAndDesiredEnvPaths = (envPath, projectRoot) => {
  const exampleEnvPath = path.resolve(projectRoot, envPath);
  const desiredEnvPath = exampleEnvPath.replace('.example', '');
  return { exampleEnvPath, desiredEnvPath };
};

export { getExampleAndDesiredEnvPaths };
