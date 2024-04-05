import { Response } from "express";
const path = require("path");
import {
  apiResponse,
  AppError,
  commonErrors,
  failedResponse,
  logger,
  successResponse,
} from "@wotm/utils";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { Model } from "sequelize/types";
import * as Sentry from "@sentry/node";

require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

export class BaseController {
  protected returnSuccessResponse(res, resp) {
    return apiResponse(res, successResponse(resp), StatusCodes.OK);
  }

  protected returnErrorResponse(res, error) {
    if (error.code) {
      res.statusMessage = error.msg;
      return apiResponse(res, error, StatusCodes.EXPECTATION_FAILED);
    } else {
      return apiResponse(
        res,
        failedResponse(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)),
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  protected returnErrorResponseV2(res, error) {
    Sentry.captureException(error);
    logger.logger.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // if error is from sequelize, create an AppError for it
      const errorDescription = error.errors.map((err) => err.message);
      error = new AppError(
        commonErrors.InvalidArgument,
        JSON.stringify(errorDescription),
        true
      );
    } else if (error.name?.startsWith("Sequelize")) {
      const errorDescription = error.errors?.map((err) => err.message);
      error = new AppError(
        commonErrors.ServerError,
        JSON.stringify(errorDescription) || error.name,
        true
      );
    }
    return res.status(error.httpCode || 500).json({
      code: error.httpCode || 500,
      // error.code and error.msg belongs to AppErrorCodes (previous way of throwing error)
      status: error.name || error.code || "INTERNAL",
      message: error.message || error.msg || "Please check server logs.",
    });
  }

  protected getUserUUID(res: Response) {
    let userUUID;
    if (res.locals.user != undefined) {
      userUUID = res.locals.user.oid
        ? res.locals.user.oid
        : process.env.ADMIN_DEFAULT;
    } else {
      userUUID = process.env.ADMIN_DEFAULT;
    }
    return userUUID as string;
  }



  protected getUserEmail(res: Response) {
    if (res.locals.user) {
      return (res.locals.user.email || res.locals.user.upn) as string;
    } else {
      return null;
    }
  }

  protected getUserGroups(res: Response) {
    return res.locals.user.groups as string[];
  }

  protected getUserName(res: Response) {
    if (res.locals.user) {
      return res.locals.user.given_name as string;
    }
    return null;
  }

  protected getPaginationLimit() {
    return process.env.PAGINATION_LIMIT;
  }

  private defaultLimit = 20;
  private defaultOffset = 0;

  getPagination = (page, size) => {
    const limit = size ? +size : this.defaultLimit;
    const offset = page ? page * limit : this.defaultOffset;
    return { limit, offset };
  };

  // TODO: Update existing and future implementations to use getPagingDataV2
  getPagingData = (items, paginationData: PaginationData) => {
    const { totalItems, page, limit } = paginationData;
    const currentPage = page || this.defaultOffset;
    const currentLimit = limit || this.defaultLimit;
    const totalPages = Math.ceil(totalItems / currentLimit);
    return { totalItems, items, totalPages, currentPage };
  };

  getPagingDataV2 = (
    items: { rows: Model[]; count: number },
    page: number,
    pageSize: number
  ) => {
    const totalPages = Math.ceil(items.count / pageSize);
    const nextPage = totalPages > page + 1 ? page + 1 : null;
    return {
      totalPages,
      page,
      nextPage,
      ...items,
    };
  };
}

interface PaginationData {
  totalItems: number;
  page: number;
  limit: number;
}
