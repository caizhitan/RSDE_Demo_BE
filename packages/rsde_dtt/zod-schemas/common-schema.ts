import { acceptableDateTimeFormat, isValidDate } from "@wotm/utils";
import { z } from "zod";

export const validUUID = z.string().uuid({ message: "Invalid UUID" });

export const validUUIDs = validUUID.array();

/**
 * Must be UUID or "-".
 */
export const validUUIDHyphen = z.union([
  z.string().uuid({ message: "Invalid UUID" }),
  z.literal("-"),
]);

export const validPage = z
  .string()
  .transform((val) => parseInt(val))
  .refine((val) => val >= 0, { message: "page must be >= 0" });

export const validPageSize = z
  .string()
  .transform((val) => parseInt(val))
  .refine((val) => val > 0, { message: "pageSize must be > 0" });

export const validOffset = z.number().int();

export const validLimit = z.number().int();

/**
 * DateTime must be in format: YYYY-MM-DDTHH:mm:ssZ
 */
export const validDateTime = z
  .string()
  .or(z.date())
  .refine((dt) => isValidDate(dt, true, acceptableDateTimeFormat), {
    message: `Invalid date time. Format must be ${acceptableDateTimeFormat}.`,
  });

export const validDate = z
  .string()
  .refine((date) => isValidDate(date, true, "YYYY-MM-DD"), {
    message: "Invalid date",
  });

export const validTime = z
  .string()
  .refine((time) => isValidDate(time, false, "HH:mm:ss"), {
    message: "Invalid time",
  });

export const validFrequency = z.union([
  z.literal("DAILY"),
  z.literal("WEEKLY"),
  z.literal("MONTHLY"),
  z.literal("BIMONTHLY"),
  z.literal("TRIMONTHLY"),
  z.literal("YEARLY"),
]);

/**
 * Name must be a string and not contain underscore.
 */
export const validName = z.string().refine((name) => !name.includes("_"), {
  message: "Name must not contain underscore.",
});

export const validEmail = z
  .string()
  .email({ message: "Invalid email format." });

export const validMetadata = z.record(z.any());
