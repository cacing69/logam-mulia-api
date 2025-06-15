import request from "supertest";
import { loginAndGetToken } from "../helpers/auth.helper";
import app from "../../../src/app";

describe("Auth Login Endpoint E2E", () => {
  const baseRoute = "/auth/me";

  let token: string;

  beforeAll(async () => {
    token = await loginAndGetToken();
  });

  it(`GET ${baseRoute} - Error unathorized`, async () => {
    const response = await request(app.callback()).get(`${baseRoute}`);

    expect(response.status).toBe(401);
  });

  it(`GET ${baseRoute} - Success get profile info`, async () => {
    const response = await request(app.callback())
      .get(`${baseRoute}`)
      .set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.email).toBeDefined();
  });
});
