import convertToOpenApiSchema from "zod-to-json-schema";
import { authTokenPayload } from "@features/auth/application/payloads/auth-token.payload";
import { authTokenResponseZod } from "@features/auth/infrastructures/http/responses/auth-token.response";
import { errorResponseZod } from "@shared/responses/error.response";
import { successResponseZod } from "@shared/responses/success.response";
import { testPublicResponseZod } from "@features/test/infrastructures/http/responses/test-public.response";
import { userCreatePayload } from '@features/user/application/payloads/user-create.payload';

export const openapiComponents = {
    components: {
        schemas: {
        },
        securitySchemes: {
        },
        parameters: {
        },
        responses: {
            // Response
            AuthTokenResponse: convertToOpenApiSchema(authTokenResponseZod),
            ErrorResponse: convertToOpenApiSchema(errorResponseZod),
            SuccessResponse: convertToOpenApiSchema(successResponseZod),
            TestPublicResponse: convertToOpenApiSchema(testPublicResponseZod),

        },
        requestBodies: {
            // Validation
            AuthTokenPayload: convertToOpenApiSchema(authTokenPayload),
            UserCreatePayload: convertToOpenApiSchema(userCreatePayload),
        }
    },
};
