/* eslint-disable no-param-reassign */
import { uuidv4 } from '~/utils/uuid';

const enhanceWithUuids = (obj) => {
  Object.values(obj).forEach((val) => {
    if (val instanceof Object) {
      val[Symbol.for('id')] = uuidv4();
      enhanceWithUuids(val);
    }
  });
};

export { enhanceWithUuids };
