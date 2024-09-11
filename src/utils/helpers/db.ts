import * as _ from 'lodash';
import { IUser } from '../../models/interfaces/user.interface';
import { IUnsanitizedUser } from '../../models/interfaces/user.interface';

type AnyObject = Record<string, any>;

export function convertToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => convertToCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce<AnyObject>((accumulator, currentKey) => {
      accumulator[_.camelCase(currentKey)] = convertToCamelCase(obj[currentKey]);
      return accumulator;
    }, {});
  }
  return obj;
}

export const sanitizeUser = (user: IUnsanitizedUser):IUser => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};