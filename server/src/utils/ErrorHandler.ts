import { ApolloError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { logger } from './Logger';

export class AppError extends ApolloError {
  constructor(message: string, code: string, public statusCode: number = 500) {
    super(message, code);
    Object.defineProperty(this, 'name', { value: 'AppError' });
  }
}

export const formatError = (error: GraphQLError) => {
  const { message, extensions } = error;
  
  // Log the error
  logger.error(`${extensions?.code || 'INTERNAL_SERVER_ERROR'}: ${message}`, {
    stack: error.stack,
    path: error.path,
  });

  // Mask internal errors in production
  if (process.env.NODE_ENV === 'production') {
    if (extensions?.code === 'INTERNAL_SERVER_ERROR') {
      return new GraphQLError('Internal server error');
    }
  }

  return error;
};
