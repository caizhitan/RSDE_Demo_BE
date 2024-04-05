import { Response } from "express";

export function getUserUUID(res: Response): string | null {
  return res.locals?.user?.oid || null;
}

export function getUserEmail(res: Response): string | null {
  return res.locals.user.upn || res.locals.user.email || null;
}

export function getUserGroups(res: Response): string[] | null {
  return res.locals?.user?.groups || null;
}

export function getUserName(res: Response): string | null {
  return res.locals?.user?.given_name || null;
}
