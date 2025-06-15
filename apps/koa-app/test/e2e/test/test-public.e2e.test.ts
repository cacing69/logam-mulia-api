import request from "supertest";
import app from "../../../src/app";

describe("Test Public Endpoint E2E", () => {
  const baseRoute = "/test/public";

  it(`GET ${baseRoute} - Success with valid credentials`, async () => {
    const response = await request(app.callback()).get(`${baseRoute}`);

    expect(response.status).toBe(200);
    expect(response.body.data.type).toBe("public");
  });
});
