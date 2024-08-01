import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return async (req, res, next) => {
    const body = req.body;
    console.log(body);
    try {
      await schema.validateAsync(body, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.message;
      const validationError = createHttpError(400, 'Bad request', {
        errors,
      });
      next(validationError);
    }
  };

};
