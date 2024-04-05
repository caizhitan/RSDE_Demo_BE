import { Controller, Get } from "@wotm/decorater";
import { DB } from "../sqlz-cli/models";
import { Request, Response } from "express";
import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/user-service";

@Controller("/me")
export default class UserRoute {
  db: DB;
  userController: UserController;
  constructor(db: DB) {
    this.db = db;
    this.userController = new UserController(new UserService(this.db));
  }

  @Get("/")
  public getUser(req: Request, res: Response) {
    return this.userController.getUser(req, res);
  }
}
