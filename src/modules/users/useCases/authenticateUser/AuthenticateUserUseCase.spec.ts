import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "jdoe@test.com",
      password: await hash("1234", 8),
    });

    const response = await authenticateUserUseCase.execute({
      email: "jdoe@test.com",
      password: "1234",
    });

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
  });

  it("should not be able to authenticate with a non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "non@existent.com",
        password: "non-existent",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong password", async () => {
    expect(async () => {
      await usersRepository.create({
        name: "John Doe",
        email: "jdoe@email.com",
        password: await hash("1234", 8),
      });

      await authenticateUserUseCase.execute({
        email: "jdoe@email.com",
        password: "wrong-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong email", async () => {
    expect(async () => {
      await usersRepository.create({
        name: "John Doe",
        email: "jdoe@email.com",
        password: await hash("1234", 8),
      });

      const response = await authenticateUserUseCase.execute({
        email: "non@existent.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});