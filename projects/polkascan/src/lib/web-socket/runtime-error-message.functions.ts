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
import { generateObjectQuery, generateObjectsListQuery, isArray, isNumber, isObject, isString } from './helpers';

const runtimeErrorMessageFields: (keyof pst.RuntimeErrorMessage)[] = [
  'specName',
  'specVersion',
  'pallet',
  'errorName',
  'palletIdx',
  'errorIdx',
  'documentation'
];

export const getRuntimeErrorMessage = (adapter: Adapter) => {
  return async (specName: string, specVersion: number, pallet: string, errorName: string): Promise<pst.RuntimeErrorMessage> => {
    const filters: string[] = [];

    if (isString(specName) && isNumber(specVersion) && isString(pallet) && isString(errorName)) {
      filters.push(`specName: "${specName}"`);
      filters.push(`specVersion: ${specVersion}`);
      filters.push(`pallet: "${pallet}"`);
      filters.push(`errorName: "${errorName}"`);
    } else {
      throw new Error(
        '[PolkascanAdapter] getRuntimeErrorMessage: Provide the specName (string), specVersion (number), pallet (string) and errorName (string).'
      );
    }

    const query = generateObjectQuery('getRuntimeErrorMessage', runtimeErrorMessageFields, filters);

    const result = adapter.socket ? await adapter.socket.query(query) : {};
    const runtimeErrorMessage: pst.RuntimeErrorMessage = result.getRuntimeErrorMessage;
    if (isObject(runtimeErrorMessage)) {
      return runtimeErrorMessage;
    } else {
      throw new Error(`[PolkascanAdapter] getRuntimeErrorMessage: Returned response is invalid.`);
    }
  };
};


export const getRuntimeErrorMessages = (adapter: Adapter) => {
  return async (
    specName: string, specVersion: number, pallet?: string, pageSize?: number, pageKey?: string
  ): Promise<pst.ListResponse<pst.RuntimeErrorMessage>> => {
    const filters: string[] = [];

    if (isString(specName) && isNumber(specVersion)) {
      filters.push(`specName: "${specName}"`);
      filters.push(`specVersion: ${specVersion}`);
      if (isString(pallet)) {
        filters.push(`pallet: "${pallet}"`);
      }
    } else {
      throw new Error(
        '[PolkascanAdapter] getRuntimeErrorMessages: Provide the specName (string), specVersion (number) and optionally pallet (string).'
      );
    }

    const query = generateObjectsListQuery('getRuntimeErrorMessages', runtimeErrorMessageFields, filters, pageSize, pageKey);

    const result = adapter.socket ? await adapter.socket.query(query) : {};
    const RuntimeErrorMessages = result.getRuntimeErrorMessages.objects;
    if (isArray(RuntimeErrorMessages)) {
      return result.getRuntimeErrorMessages;
    } else {
      throw new Error(`[PolkascanAdapter] getRuntimeErrorMessages: Returned response is invalid.`);
    }
  };
};