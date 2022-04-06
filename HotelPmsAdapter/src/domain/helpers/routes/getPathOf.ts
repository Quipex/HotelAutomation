import { resolveV1 } from '~/common/utils/routes';

const getPathOf = (obj) => resolveV1(obj).path;

export { getPathOf };
