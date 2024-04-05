import "reflect-metadata";

import { RouteDefinition } from "../model/RouteDefinition";

interface Constructor<Instance extends object> {
  new (...args: any[]): Instance;
}

interface Method<Context extends object = object> {
  (this: Context, ...args: any[]): any;
}

interface MethodDecoratorCustom<Instance extends object = object> {
  (
    target: Instance | Constructor<Instance>,
    key: PropertyKey,
    descriptor: TypedPropertyDescriptor<
      Method<Instance | Constructor<Instance>>
    >
  ): void | TypedPropertyDescriptor<Method<Instance | Constructor<Instance>>>;
}

export const Get =
  <Instance extends object>(path: string): MethodDecoratorCustom<Instance> =>
  (target, key, descriptor) => {
    // const method = descriptor.value!;
    const methodName = typeof key === "string" ? key : `[${String(key)}]`;

    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as Array<RouteDefinition>;

    routes.push({
      requestMethod: "get",
      path,
      methodName: methodName,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
