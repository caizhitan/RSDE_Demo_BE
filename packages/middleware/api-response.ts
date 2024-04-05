import { Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { parse } from "js2xmlparser";
import {
  applicationJson,
  applicationXml,
  FailedResponse,
  SuccessResponse,
} from "./types/types";

export interface ApiResponse {
  <T>(
    res: Response,
    data: T,
    statusCode: number,
    rootElement?: string
  ): Response;
}

export const apiResponse: ApiResponse = (
  res,
  data,
  statusCode,
  rootElement = ""
): Response => {
  res.type(applicationJson);
  res.status(statusCode).send(data);
  return res;
  // return res.format({
  //     json: () => {
  //         console.log("JSON TYPE")
  //         // res.type(applicationJson);
  //         // res.status(statusCode).send(data);
  //     },
  //     xml: () => {
  //         console.log("XML TYPE")
  //         // res.type(applicationXml);
  //         // res.status(statusCode).send(parse(rootElement || "", data));
  //     },
  //     default: () => {
  //         res.status(StatusCodes.NOT_ACCEPTABLE).send(getReasonPhrase(StatusCodes.NOT_ACCEPTABLE));
  //     },
  // });
};

export function successResponse(data): SuccessResponse {
  return {
    success: true,
    data,
  };
}
export function failedResponse(data): FailedResponse {
  return {
    success: false,
    data,
  };
}
