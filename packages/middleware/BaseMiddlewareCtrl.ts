export class BaseMiddlewareCtrl {
  constructor(protected ctrlName: string) {}

  verifyGroupAccess(groupName: string[]): boolean {
    // build test,uat,prod

    return true;
  }
}
