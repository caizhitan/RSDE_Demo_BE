import { AppError, commonErrors } from ".";
import { z } from "zod";

/**
 * Checks if input is valid.
 * @param input the data to be validated
 * @param schema the schema to validate with
 */
export function zodValidator<T extends z.ZodTypeAny>(
  input: unknown,
  schema: T
): z.infer<typeof schema> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issues = JSON.stringify(result.error.issues);
    throw new AppError(commonErrors.InvalidArgument, issues, true);
  }
  return result.data;
}
