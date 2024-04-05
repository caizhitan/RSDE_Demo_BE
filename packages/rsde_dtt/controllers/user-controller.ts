import { BaseController } from "@wotm/middleware";
import { UserService } from "../services/user-service";
import { Request, Response } from "express";
import { zodValidator } from "@wotm/utils";
import { getUserSchema } from "../zod-schemas/user-schema";

export class UserController extends BaseController {
  public constructor(private userService: UserService) {
    super();
  }

  public async getUser(req: Request, res: Response) {
    try {
      const userUUID = this.getUserUUID(res);

      const options = zodValidator(
        {
          uuid: userUUID,
        },
        getUserSchema
      );
      const result = await this.userService.getUser(options);
      return this.returnSuccessResponse(res, result);
    } catch (error) {
      return this.returnErrorResponseV2(res, error);
    }
  }
}
