/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { diag } from '@opentelemetry/api';
import {
  DnsInstrumentation,
  DnsInstrumentationConfig,
} from '@opentelemetry/instrumentation-dns';
import {
  ExpressInstrumentation,
  ExpressInstrumentationConfig,
} from '@opentelemetry/instrumentation-express';
import {
  HttpInstrumentation,
  HttpInstrumentationConfig,
} from '@opentelemetry/instrumentation-http';
import {
  GraphQLInstrumentation,
  GraphQLInstrumentationConfig,
} from '@opentelemetry/instrumentation-graphql';
import {
  GrpcInstrumentation,
  // GrpcInstrumentationConfig,
} from '@opentelemetry/instrumentation-grpc';
import { GrpcInstrumentationConfig } from '@opentelemetry/instrumentation-grpc/build/src/types';
import { KoaInstrumentation } from '@opentelemetry/instrumentation-koa';
// import {
//   MySQLInstrumentation,
//   MySQLInstrumentationConfig,
// } from '@opentelemetry/instrumentation-mysql';
import {
  IORedisInstrumentation,
  IORedisInstrumentationConfig,
} from '@opentelemetry/instrumentation-ioredis';
import {
  MongoDBInstrumentation,
  MongoDBInstrumentationConfig,
} from '@opentelemetry/instrumentation-mongodb';
import {
  PgInstrumentation,
  PgInstrumentationConfig,
} from '@opentelemetry/instrumentation-pg';
// import {
//   RedisInstrumentation,
//   RedisInstrumentationConfig,
// } from '@opentelemetry/instrumentation-redis';
import {
  Instrumentation,
  InstrumentationConfig,
} from '@opentelemetry/instrumentation';

const InstrumentationMap = {
  '@opentelemetry/instrumentation-dns': {
    instrumentation: DnsInstrumentation,
    config: { enabled: true } as DnsInstrumentationConfig,
  },
  '@opentelemetry/instrumentation-express': {
    instrumentation: ExpressInstrumentation,
    config: { enabled: true } as ExpressInstrumentationConfig,
  },
  '@opentelemetry/instrumentation-http': {
    instrumentation: HttpInstrumentation,
    config: { enabled: true } as HttpInstrumentationConfig,
  },
  '@opentelemetry/instrumentation-graphql': {
    instrumentation: GraphQLInstrumentation,
    config: { enabled: true } as GraphQLInstrumentationConfig,
  },
  '@opentelemetry/instrumentation-grpc': {
    instrumentation: GrpcInstrumentation,
    config: { enabled: true } as GrpcInstrumentationConfig,
  },
  '@opentelemetry/instrumentation-koa': {
    instrumentation: KoaInstrumentation,
    config: { enabled: true } as InstrumentationConfig, // TODO no koa config type?
  },
  '@opentelemetry/instrumentation-ioredis': {
    instrumentation: IORedisInstrumentation,
    config: { enabled: true } as IORedisInstrumentationConfig,
  },
  '@opentelemetry/instrumentation-mongodb': {
    instrumentation: MongoDBInstrumentation,
    config: { enabled: true } as MongoDBInstrumentationConfig,
  },
  // '@opentelemetry/instrumentation-mysql': {
  //   instrumentation: MySQLInstrumentation,
  //   config: { enabled: true } as MySQLInstrumentationConfig,
  // },
  '@opentelemetry/instrumentation-pg': {
    instrumentation: PgInstrumentation,
    config: { enabled: true } as PgInstrumentationConfig,
  },
  // '@opentelemetry/instrumentation-redis': {
  //   instrumentation: RedisInstrumentation,
  //   config: { enabled: true } as RedisInstrumentationConfig,
  // },
};

type InstrumentationConfigMap = {
  [Name in keyof typeof InstrumentationMap]?: typeof InstrumentationMap[Name]['config'];
};

export function getNodeAutoInstrumentations(
  inputConfigs: InstrumentationConfigMap = {}
): Instrumentation[] {
  for (const name of Object.keys(inputConfigs)) {
    if (!Object.prototype.hasOwnProperty.call(InstrumentationMap, name)) {
      diag.error(`Provided instrumentation name "${name}" not found`);
      continue;
    }
  }

  const instrumentations: Instrumentation[] = [];

  for (const name of Object.keys(InstrumentationMap) as Array<
    keyof typeof InstrumentationMap
  >) {
    const Instance = InstrumentationMap[name].instrumentation;

    const userConfig = Object.assign(
      Object.create(null),
      InstrumentationMap[name].config,
      inputConfigs[name]
    );

    if (userConfig.enabled === false) {
      diag.debug(`Disabling instrumentation for ${name}`);
      continue;
    }

    try {
      instrumentations.push(new Instance(userConfig as any));
    } catch (e) {
      diag.error(e);
    }
  }

  return instrumentations;
}
