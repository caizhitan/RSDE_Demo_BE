import "reflect-metadata";

import { RouteDefinition } from "../model/RouteDefinition";
import { MethodDecoratorCustom } from "../model/MethodModels";

enum ApiMethod {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}

export const Get =
  <Instance extends object>(path: string): MethodDecoratorCustom<Instance> =>
  (target, key, descriptor) => {
    // const method = descriptor.value!;
    const methodName = typeof key === "string" ? key : `[${String(key)}]`;
    addMetaData(path, methodName, target.constructor, ApiMethod.GET);
  };

export const Put =
  <Instance extends object>(path: string): MethodDecoratorCustom<Instance> =>
  (target, key, descriptor) => {
    // const method = descriptor.value!;
    const methodName = typeof key === "string" ? key : `[${String(key)}]`;
    addMetaData(path, methodName, target.constructor, ApiMethod.PUT);
  };

export const Delete =
  <Instance extends object>(path: string): MethodDecoratorCustom<Instance> =>
  (target, key, descriptor) => {
    // const method = descriptor.value!;
    const methodName = typeof key === "string" ? key : `[${String(key)}]`;
    addMetaData(path, methodName, target.constructor, ApiMethod.DELETE);
  };

export const Post =
  <Instance extends object>(path: string): MethodDecoratorCustom<Instance> =>
  (target, key, descriptor) => {
    // const method = descriptor.value!;
    const methodName = typeof key === "string" ? key : `[${String(key)}]`;
    addMetaData(path, methodName, target.constructor, ApiMethod.POST);
  };

export const Patch =
  <Instance extends object>(path: string): MethodDecoratorCustom<Instance> =>
  (target, key, descriptor) => {
    // const method = descriptor.value!;
    const methodName = typeof key === "string" ? key : `[${String(key)}]`;
    addMetaData(path, methodName, target.constructor, ApiMethod.PATCH);
  };

function addMetaData(
  path: string,
  methodName: string,
  t: Function,
  methodType: ApiMethod
) {
  if (!Reflect.hasMetadata("routes", t)) {
    Reflect.defineMetadata("routes", [], t);
  }
  // Get the routes stored so far, extend it by the new route and re-set the metadata.
  const routes = Reflect.getMetadata("routes", t) as Array<RouteDefinition>;

  routes.push({
    requestMethod: methodType,
    path,
    methodName: methodName,
  });
  Reflect.defineMetadata("routes", routes, t);
}
