import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )
  });

  it("Should be able to create a new statement with type deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "jane doe",
      email: "jane@example.com",
      password: "fakePassword"
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "Fake description",
      amount: 250,
      type: OperationType.DEPOSIT
    }

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement).toHaveProperty("id");

  });

  it("Should not be able to create a new statement if user does not exist", async () => {
    const statement: ICreateStatementDTO = {
      user_id: "FakeId",
      description: "Fake description",
      amount: 250,
      type: OperationType.DEPOSIT
    }

    expect(
      createStatementUseCase.execute(statement)
    ).rejects.toEqual( new CreateStatementError.UserNotFound());
  });

  it("Should not be able to withdraw with a balance less than the amount", async () => {
    const user = await createUserUseCase.execute({
      name: "jane doe",
      email: "jane@example.com",
      password: "123"
    });
    
    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "Fake description",
      amount: 250,
      type: OperationType.DEPOSIT
    };

    await createStatementUseCase.execute(statement);

    const statementWithdraw: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "Fake description",
      amount: 300,
      type: OperationType.WITHDRAW
    };

    await expect(
      createStatementUseCase.execute(statementWithdraw)
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());

  })



})