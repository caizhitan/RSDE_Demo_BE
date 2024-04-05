interface AccessGroups {
  group: string[];
}

export function accessGroups(list: AccessGroups) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = list;
  };
}
