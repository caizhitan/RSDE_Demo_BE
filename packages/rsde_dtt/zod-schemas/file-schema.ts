import { z } from "zod";
import { validUUID } from "./common-schema";

export const createFileSchema = z.object({
    fileName: z.string(),
    fileType: z.string(),
    fileURL: z.string(),
});

export const getFileSchema = z.object({
    fileID: validUUID,
});

export const updateFileSchema = z.object({
    fileID: validUUID,
    fileName: z.string(),
    fileType: z.string(),
    fileURL: z.string(),
});

export const deleteFileSchema = z.object({
    fileID: validUUID,
});