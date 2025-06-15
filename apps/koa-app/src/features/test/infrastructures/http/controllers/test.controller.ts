import { Context } from "koa";
import {
  successResponse,
  errorResponse,
} from "@shared/utils/response.util";

export const handlePublic = (ctx: Context) => {
  try {
    successResponse(
      ctx,
      {
        type: "public",
      },
      "Test successfully",
      200
    );
  } catch (err: any) {
    errorResponse(ctx, null, err.message, 400);
  }
}
