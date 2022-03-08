import { resolveV1 } from '~/common/utils/routes';

const rv1 = <T>(path: T) => {
  const { path: fullPath, method } = resolveV1(path);
  return ({ compactPath: path, path: fullPath, method });
};

export { rv1 };
