/* eslint-disable no-param-reassign */
import { CompactRoute, CompactRouteFragment, CompactRoutesMap, HttpMethod, Route, RoutesMap } from '~/types';

const mapCompactToFullRoutes = (
  compactRoutesMap: CompactRoutesMap
): RoutesMap => processTree(compactRoutesMap) as RoutesMap;

const processTree = (branch: CompactRouteFragment, accumulatedPath = '/') => {
  return Object.entries(branch).reduce((acc, [pathChunk, content]) => {
    const route = mapBranchToRoute([pathChunk, content], accumulatedPath);
    acc[pathChunk] = { ...route, ...content as object };
    if (route.method) {
      return acc;
    }
    processLeaves(
      content as CompactRouteFragment,
      acc[pathChunk] as Record<string, unknown>,
      route.path ?? accumulatedPath
    );
    return acc;
  }, {} as Record<string, unknown>);
};

const processLeaves = (
  branch: CompactRouteFragment,
  acc: Record<string, unknown>,
  accumulatedPath: string
) => {
  Object.entries(branch).forEach(([pathChunk, content]) => {
    const route = mapBranchToRoute([pathChunk, content], accumulatedPath);
    acc[pathChunk] = { ...route, ...content as object };
    if (route.method) {
      return;
    }
    processLeaves(
      content as CompactRouteFragment,
      acc[pathChunk] as Record<string, unknown>,
      route.path ?? accumulatedPath
    );
  });
};

const mapBranchToRoute = (
  [pathChunkOrPathAlias, branchContents]: [string, unknown],
  accumulatedPath: string
): Partial<Route> => {
  const [pathName, httpMethod] = pathChunkOrPathAlias.split('$');
  if (httpMethod) {
    const { relativePath } = branchContents as CompactRoute;
    return {
      path: concatWithJoining(accumulatedPath, relativePath),
      method: httpMethod.toUpperCase() as HttpMethod
    };
  }
  return {
    path: concatWithJoining(accumulatedPath, pathName),
    relativePath: pathName
  };
};

const concatWithJoining = (part1: string, part2: string) => {
  if (part2 === '/' || part2.length === 0) {
    return part1;
  }
  if (!part1.endsWith('/')) {
    part1 = part1.concat('/');
  }
  return part1.concat(part2);
};

export { mapCompactToFullRoutes };
