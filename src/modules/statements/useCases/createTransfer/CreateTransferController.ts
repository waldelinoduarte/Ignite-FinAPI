import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    
    const { id: sender_id } = request.user;
    const { user_id: receiver_id } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transferOperation = await createTransferUseCase.execute({
      amount,
      description,
      sender_id,
      receiver_id
    });

    return response.status(201).json(transferOperation);
  }
}

