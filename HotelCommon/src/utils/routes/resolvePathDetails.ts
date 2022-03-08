import { fullRoutesV1 } from '~/maps/routes/routes.v1';
import { Route } from '~/types/routes';

const createResolvePathDetails = (fullMap) => (path): Partial<Route> => {
  const idToFind = path[Symbol.for('id')];
  return findWithSameId(fullMap, idToFind);
};

const findWithSameId = (object: object, idToSearch: string): Partial<Route> => {
  let searchedValue;
  Object.values(object).forEach((value) => {
    if (searchedValue) {
      return;
    }
    if (value instanceof Object) {
      if (value[Symbol.for('id')] === idToSearch) {
        searchedValue = value;
        return;
      }
      searchedValue = findWithSameId(value, idToSearch);
    }
  });
  return searchedValue;
};

const resolveV1 = createResolvePathDetails(fullRoutesV1);

export { resolveV1 };
