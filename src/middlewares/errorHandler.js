import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    const response = {
      status: error.status,
      name: error.name,
      data: error.message,
    };

    if (error.errors) {
      response.errors = error.errors;
    }

    res.status(error.status).send(response);
    return;
  }

  res.status(500).send({
    status: 500,
    name: 'Something went wrong',
    data: error.message,
  });
};
