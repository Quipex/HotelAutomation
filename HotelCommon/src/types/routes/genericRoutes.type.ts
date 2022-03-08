import { HttpMethod } from '../http_method.type';

type CompactRoute = {
  // Path relative to the parent prop names
  relativePath: string;
};

type Route = {
  path: string;
  method: HttpMethod;
} & Partial<CompactRoute>;

type BranchedTree<T> = Record<string, T | Record<string, T | Record<string, T>>>;
type BranchedTreeFragment<T> = Record<string, T | unknown>;

/**
 * We're assuming that properties that correspond to methods are defined as <code>relativePathAlias$method</code>,
 * where relativePathAlias shouldn't be the same as relativePath <br>
 * In case we specify intermediate path chunks, they should be named exactly as
 */
type CompactRoutesMap = BranchedTree<CompactRoute>;

type CompactRouteFragment = BranchedTreeFragment<CompactRoute>;

type RoutesMap = BranchedTree<Route>;

export type {
  CompactRoute,
  CompactRouteFragment,
  CompactRoutesMap,
  Route,
  RoutesMap
};
