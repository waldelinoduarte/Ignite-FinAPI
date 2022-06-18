import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )

  });

  it("Should be able to get balance without statement", async () => {
    const user = await createUserUseCase.execute({
      name: "jane doe",
      email: "jane@example.com",
      password: "456789"
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    })

    expect(balance).toHaveProperty("balance");
  });

  it("Should be able to get balance with statement", async () => {
    const user = await createUserUseCase.execute({
      name: "jane doe",
      email: "jane@example.com",
      password: "456789"
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "Fake description",
      amount: 250,
      type: OperationType.DEPOSIT
    }

    await createStatementUseCase.execute(statement);

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    })

    expect(balance).toHaveProperty("statement");
  });

  it("Should not be able to get balance to non-existing user", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "FakeUserID",
      })
    ).rejects.toEqual(new GetBalanceError());

  })

});
