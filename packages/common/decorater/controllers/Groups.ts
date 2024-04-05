import "reflect-metadata";

import { AuthGroupDefinitions } from "../model/AuthGroupDefinition";
import { MethodDecoratorCustom } from "../model/MethodModels";

export const Groups =
  <Instance extends object>(
    accGroups: string[]
  ): MethodDecoratorCustom<Instance> =>
  (target, key, descriptor) => {
    // const method = descriptor.value!;
    const methodName = typeof key === "string" ? key : `[${String(key)}]`;

    if (!Reflect.hasMetadata("authGroups", target.constructor)) {
      Reflect.defineMetadata("authGroups", [], target.constructor);
    }

    const authgroups = Reflect.getMetadata(
      "authGroups",
      target.constructor
    ) as Array<AuthGroupDefinitions>;

    authgroups.push({
      authGroups: accGroups,
      methodName: methodName,
    });
    Reflect.defineMetadata("authGroups", authgroups, target.constructor);
  };
