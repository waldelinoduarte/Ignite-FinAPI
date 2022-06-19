import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
  export class ReceiverUserNotFound extends AppError {
    constructor() {
      super('Receiver user not found', 404);
    }
  }
 
  export class SenderUserNotFound extends AppError {
    constructor() {
      super('Sender user not found', 404);
    }
  }

  export class InvalidAmount extends AppError {
    constructor() {
      super('Amount must be greater than 0', 400);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class NoTransferToYourSelf extends AppError {
    constructor() {
        super("You can not to transfer to your self!", 401)
    }
}
}
