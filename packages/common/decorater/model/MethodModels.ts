export interface Constructor<Instance extends object> {
  new (...args: any[]): Instance;
}

export interface Method<Context extends object = object> {
  (this: Context, ...args: any[]): any;
}

export interface MethodDecoratorCustom<Instance extends object = object> {
  (
    target: Instance | Constructor<Instance>,
    key: PropertyKey,
    descriptor: TypedPropertyDescriptor<
      Method<Instance | Constructor<Instance>>
    >
  ): void | TypedPropertyDescriptor<Method<Instance | Constructor<Instance>>>;
}
