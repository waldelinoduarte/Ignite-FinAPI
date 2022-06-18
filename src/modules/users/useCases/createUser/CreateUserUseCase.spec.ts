import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("Create User", () => { 
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to create a new user", async () => {
    const response = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@server.com",
      password: "123"
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user with email exists", async () => {
    expect(async() => {
      await createUserUseCase.execute({
        name: "Jane Doe",
        email: "jdoe@same.com",
        password: "456789"
      });
      await createUserUseCase.execute({
        name: "John Doe",
        email: "jdoe@same.com",
        password: "456789"
      });

    }).rejects.toBeInstanceOf(CreateUserError);
  });

});