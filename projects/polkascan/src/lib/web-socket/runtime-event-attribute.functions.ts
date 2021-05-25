/*
 * PolkADAPT
 *
 * Copyright 2020 Stichting Polkascan (Polkascan Foundation)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Adapter } from '../polkascan';
import * as pst from '../polkascan.types';
import { generateObjectsListQuery, isArray, isNumber, isString } from './helpers';

const runtimeEventAttributeFields: (keyof pst.RuntimeEventAttribute)[] = [
  'specName',
  'specVersion',
  'pallet',
  'eventName',
  'eventAttributeIdx',
  'scaleType'
];


export const getRuntimeEventAttributes = (adapter: Adapter) => {
  return async (
    specName: string, specVersion: number, pallet: string, eventName: string, pageSize?: number, pageKey?: string
  ): Promise<pst.ListResponse<pst.RuntimeEventAttribute>> => {
    const filters: string[] = [];

    if (isString(specName) && isNumber(specVersion) && isString(pallet) && isString(eventName)) {
      filters.push(`specName: "${specName}"`);
      filters.push(`specVersion: ${specVersion}`);
      filters.push(`pallet: "${pallet}"`);
      filters.push(`eventName: "${eventName}"`);
    } else {
      throw new Error(
        '[PolkascanAdapter] getRuntimeEventAttributes: Provide the specName (string), specVersion (number), pallet (string) and eventName (string).'
      );
    }

    const query = generateObjectsListQuery('getRuntimeEventAttributes', runtimeEventAttributeFields, filters, pageSize, pageKey);

    const result = adapter.socket ? await adapter.socket.query(query) : {};
    const runtimeEventAttributes = result.getRuntimeEventAttributes.objects;
    if (isArray(runtimeEventAttributes)) {
      return result.getRuntimeEventAttributes;
    } else {
      throw new Error(`[PolkascanAdapter] getRuntimeEventAttributes: Returned response is invalid.`);
    }
  };
};