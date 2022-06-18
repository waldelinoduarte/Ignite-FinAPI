import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin123", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'jdoe@test.com', '${password}', 'now()', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "jdoe@test.com",
      password: "admin123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate with fake password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "jdoe@test.com",
      password: "fakePassword",
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate with fake email", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "fake@test.com",
      password: "admin123",
    });

    expect(response.status).toBe(401);
  });
});