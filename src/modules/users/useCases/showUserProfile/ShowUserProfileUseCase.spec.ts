import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => { 
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show profile of user by id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@server.com",
      password: "123"
    });

    const profileUser = await showUserProfileUseCase.execute(user.id as string);

    expect(user).toEqual(profileUser);
  });

  it("Should not be able to show a non-existent profile of user by id", async () => {
   
    await expect(
      showUserProfileUseCase.execute("12345")
    ).rejects.toEqual(new ShowUserProfileError());
  })
  
  

});