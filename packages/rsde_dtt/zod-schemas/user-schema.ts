import { z } from "zod";
import { validEmail, validUUID } from "./common-schema";

export const createUserSchema = z.object({
  uuid: validUUID,
  email: validEmail,
});

export const getUserSchema = z.object({
  uuid: validUUID,
});

export const updateUserSchema = z.object({
  uuid: validUUID,
  status: z.string(),
});

export const deleteUserSchema = z.object({
  uuid: validUUID,
});
