import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  EntityNotFoundError,
  QueryFailedError,
  QueryRunnerAlreadyReleasedError,
  TransactionAlreadyStartedError,
  TransactionNotStartedError,
} from 'typeorm';
import { JsonWebTokenError } from 'jsonwebtoken';

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
        name: err.name,
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
        name: err.name,
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
        name: err.name,
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
        // message: err.message,
        name: err.name,
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
        // message: 'Transaction not started',
        message: err.message,
        name: err.name,
        // errors: err,
      },
    });
  }

  // JWT Error
  if (err instanceof JsonWebTokenError) {
    console.log('JWT Error');
    res.status(401).json({
      error: {
        type: 'jwt_error',
        message: err.message,
        name: err.name,
        // errors: err,
      },
    });
    return;
  }

  // Generic Error
  if (err instanceof Error) {
    console.log('General Error');
    console.log(err);
    res.status(500).json({
      error: {
        type: 'api_error',
        message: err.message,
        name: err.name,
        // errors: err,
      },
    });
    return;
  }
};
