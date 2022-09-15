import { Router, Request, Response } from "express";

const AWS_LAMBDA_FUNCTION = process.env.AWS_LAMBDA_FUNCTION == "true" || false;

export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "welcome to logam mulia api",
    data: {
      requestId: new Date().getTime(),
      awsLambdaFunction: AWS_LAMBDA_FUNCTION,
      engine: AWS_LAMBDA_FUNCTION
        ? "playwright-aws-lambda"
        : "playwright",
    },
    meta: {
      auth: {
        state: false,
      },
      availablePath: [
        {
          method: "get",
          path: "prices",
          params: {
            site: "anekalogam|logammulia",
          },
        },
        {
          method: "get",
          path: "sites",
        },
      ],
    },
  });
});
