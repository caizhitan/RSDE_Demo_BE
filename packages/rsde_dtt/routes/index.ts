import fs from "fs";
import path from "path";
import { Router, Request, Response } from "express";
import { DB } from "../sqlz-cli/models";
import { azureJwtVerify } from "@wotm/authorization";
import { verifyAuthGroupAccess } from "@wotm/middleware";
import { optionalAzureJwtVerify } from "@wotm/authorization/azure/azure-ad-jwt";
import "reflect-metadata";

const basename = path.basename(__filename);

export function routes(db: DB) {
  const api = Router();

  const routeConfigs = require(path.join(__dirname, "route-config")).config;

  fs.readdirSync(__dirname)
    .filter((file) => {
      // only select route files which has 'route.ts' or 'route.js'
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.match("route.(ts|js)")
      );
    })
    .forEach((file) => {
      const route = require(path.join(__dirname, file)).default;

      // find route config related to route
      const routeConfigName = `${file
        .slice(0, -3)
        .replaceAll("-", "_")}_config`;
      const routeConfig = routeConfigs[routeConfigName];

      prepareRouterData(
        [route],
        db,
        api,
        routeConfig.exclude_jwt_check,
        routeConfig.optional_jwt_check
      );
    });
  return api;
}

function getMetaData(controller, metaDataType) {
  return Reflect.getMetadata(metaDataType, controller);
}

function prepareRouterData(T, db, api, excludedMethodList, optionalMethodList) {
  T.forEach((controller) => {
    const instance = new controller(db);
    const prefix = getMetaData(controller, "prefix");
    const routes = getMetaData(controller, "routes");
    const authGroups = getMetaData(controller, "authGroups");
    routes.forEach((route) => {
      let groupList: string[];
      authGroups.map((i) => {
        if (i.methodName == route.methodName) {
          groupList = i["authGroups"];
        }
      });
      const accessGroupList = function (req, res, next) {
        req.accessGroupList = groupList;
        req.serviceMethodName = route.methodName;
        next();
      };
      api.use(accessGroupList);

      if (excludedMethodList.indexOf(route.methodName) !== -1) {
        api[route.requestMethod](
          prefix + route.path,
          (req: Request, res: Response) => {
            instance[route.methodName](req, res);
          }
        );
      } else if (optionalMethodList.indexOf(route.methodName) !== -1) {
        api[route.requestMethod](
          prefix + route.path,
          [optionalAzureJwtVerify],
          (req: Request, res: Response) => {
            instance[route.methodName](req, res);
          }
        );
      } else {
        api[route.requestMethod](
          prefix + route.path,
          [azureJwtVerify, verifyAuthGroupAccess],
          (req: Request, res: Response) => {
            instance[route.methodName](req, res);
          }
        );
      }
    });
  });
}
