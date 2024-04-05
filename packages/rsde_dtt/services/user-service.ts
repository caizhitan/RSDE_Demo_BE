import { getUserSchema } from "../zod-schemas/user-schema";
import { DB } from "../sqlz-cli/models";
import { AppError, commonErrors } from "@wotm/utils";

export class UserService {
  public constructor(private db: DB) {}

  public async getUser(options: Zod.infer<typeof getUserSchema>) {
    const user = await this.db.users.findOne({
      where: {
        uuid: options.uuid,
      },
    });
    if (!user)
      throw new AppError(commonErrors.NotFound, "User not found.", true);
    return user;
  }
}
