import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  EntityNotFoundError,
  QueryFailedError,
  QueryRunnerAlreadyReleasedError,
  TransactionAlreadyStartedError,
  TransactionNotStartedError,
} from 'typeorm';

export const errorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Handle Middleware Error');

  // Schema Validation Error
  if (err instanceof ZodError) {
    console.log('Schema Validation Error');
    res.status(400).json({
      error: {
        type: 'validation_error',
        message: 'Validation error',
        errors: err.format(),
      },
    });
    return;
  }

  // Query Failed Error
  if (err instanceof QueryFailedError) {
    console.log('Database Query Failed');
    res.status(500).json({
      error: {
        type: 'database_error',
        message: err.message,
        errors: err.stack,
      },
    });
    return;
  }

  // Entity Not Found
  if (err instanceof EntityNotFoundError) {
    console.log('Entity Not Found');
    res.status(404).json({
      error: {
        type: 'not_found',
        message: err.message,
      },
    });
    return;
  }

  // Query Runner Already Released Error
  if (err instanceof QueryRunnerAlreadyReleasedError) {
    console.log('Query Runner Already Released');
    res.status(500).json({
      error: {
        type: 'database_error',
        message: err.message,
        errors: err,
      },
    });
  }

  // Transaction Already Started Error
  if (err instanceof TransactionAlreadyStartedError) {
    console.log('Transaction Already Started');
    res.status(500).json({
      error: {
        type: 'api_error',
        message: 'Transaction already started',
        errors: err,
      },
    });
    return;
  }

  // Transaction Not Started Error
  if (err instanceof TransactionNotStartedError) {
    console.log('Transaction Not Started');
    res.status(500).json({
      error: {
        type: 'api_error',
        message: 'Transaction not started',
        errors: err,
      },
    });
  }

  // Generic Error
  if (err instanceof Error) {
    console.log('General Error');
    res.status(500).json({
      error: {
        type: 'api_error',
        message: err.message,
        errors: err,
      },
    });
    return;
  }
};
