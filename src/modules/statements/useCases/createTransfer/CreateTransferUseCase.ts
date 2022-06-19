import { container, inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateTransferDTO } from "./CreateTransferDTO";
import { CreateTransferError } from "./CreateTransferError";


@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository

  ) {}

  async execute({
    amount,
    description,
    sender_id,
    receiver_id
  }: ICreateTransferDTO) {

    const senderUser = await this.usersRepository.findById(sender_id);

    if (!senderUser) {
      throw new CreateTransferError.SenderUserNotFound();
    }
    
    const receiverUser = await this.usersRepository.findById(receiver_id);

    if (!receiverUser) {
      throw new CreateTransferError.ReceiverUserNotFound();
    }

    if(senderUser === receiverUser) {
      throw new CreateTransferError.NoTransferToYourSelf();
    };
    
    if (amount <= 0) {
      throw new CreateTransferError.InvalidAmount();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (amount > balance) {
        throw new CreateTransferError.InsufficientFunds();
    };

    
    await this.statementsRepository.create({
      amount: amount,
      description,
      type: OperationType.WITHDRAW,
      user_id: senderUser.id as string,
    });

    const transferOperation = await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      sender_id,
      user_id: receiverUser.id as string,
    });

    return transferOperation;
  }
}
