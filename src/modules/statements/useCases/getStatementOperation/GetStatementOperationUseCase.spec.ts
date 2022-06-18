import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    )

  });

  it("Should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "jane doe",
      email: "jane@example.com",
      password: "123456"
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "Fake description",
      amount: 250,
      type: OperationType.DEPOSIT
    }

    const createdStatement = await createStatementUseCase.execute(statement);

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: createdStatement.id as string
    })

    expect(createdStatement).toEqual(getStatement);

  });

  it("Should not able to get statement operation to non-existent user", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "FakeUserID",
        statement_id: "FakeStatementID"
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  })

  it("Should not able to get statement operation to non-existent statement", async () => {

    const user = await createUserUseCase.execute({
      name: "jane doe",
      email: "jane@example.com",
      password: "123456"
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "FakeStatementID"
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  })




})