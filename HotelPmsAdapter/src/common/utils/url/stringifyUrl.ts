import { UrlObject } from 'query-string';
import * as queryString from 'query-string';

const stringifyUrl = (obj: UrlObject) => queryString.stringifyUrl(obj);

export { stringifyUrl };
