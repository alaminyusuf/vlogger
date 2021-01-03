import { InputOptions } from './../resolvers/InputOptions';

export const validationUtil = (options: InputOptions) => {
  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'username must be greater than 2',
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include @ character',
      },
    ];
  }

  if (options.email.length <= 5 || !options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  if (options.password.length <= 5) {
    return [
      {
        field: 'password',
        message: 'password must at least be 6',
      },
    ];
  }

  return null;
};
