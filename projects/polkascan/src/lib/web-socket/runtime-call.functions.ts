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

const runtimeCallFields: (keyof pst.RuntimeCall)[] = [
  'specName',
  'specVersion',
  'pallet',
  'callName',
  'palletCallIdx',
  'lookup',
  'documentation',
  'countArguments'
];

export const getRuntimeCall = (adapter: Adapter) => {
  return async (specName: string, specVersion: number, pallet: string, callName: string): Promise<pst.RuntimeCall> => {
    const filters: string[] = [];

    if (isString(specName) && isNumber(specVersion) && isString(pallet) && isString(callName)) {
      filters.push(`specName: ${specName}`);
      filters.push(`specVersion: ${specVersion}`);
      filters.push(`pallet: ${pallet}`);
      filters.push(`callName: ${callName}`);
    } else {
      throw new Error(
        '[PolkascanAdapter] getRuntimeCall: Provide the specName (string), specVersion (number), pallet (string) and callName (string).'
      );
    }

    const query = generateObjectQuery('getRuntimeCall', runtimeCallFields, filters);

    const result = await adapter.socket.query(query);
    const runtimeCall: pst.RuntimeCall = result.getRuntimeCall;
    if (isObject(runtimeCall)) {
      return runtimeCall;
    } else {
      throw new Error(`[PolkascanAdapter] getRuntimeCall: Returned response is invalid.`);
    }
  };
};


export const getRuntimeCalls = (adapter: Adapter) => {
  return async (
    specName: string, specVersion: number, pallet: string, pageSize?: number, pageKey?: string
  ): Promise<pst.ListResponse<pst.RuntimeCall>> => {
    const filters: string[] = [];

    if (isString(specName) && isNumber(specVersion) && isString(pallet)) {
      filters.push(`specName: ${specName}`);
      filters.push(`specVersion: ${specVersion}`);
      filters.push(`pallet: ${pallet}`);
    } else {
      throw new Error(
        '[PolkascanAdapter] getRuntimeCalls: Provide the specName (string), specVersion (number) and pallet (string).'
      );
    }

    const query = generateObjectsListQuery('getRuntimeCalls', runtimeCallFields, filters, pageSize, pageKey);

    const result = await adapter.socket.query(query);
    const runtimeCalls = result.getRuntimeCalls.objects;
    if (isArray(runtimeCalls)) {
      return result.getRuntimeCalls;
    } else {
      throw new Error(`[PolkascanAdapter] getRuntimeCalls: Returned response is invalid.`);
    }
  };
};
