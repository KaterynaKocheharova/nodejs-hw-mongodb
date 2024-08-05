import app from "./app.js";
import { env } from './utils/env.js';
import { logger } from './app.js';

export const setUpServer = () => {
  const PORT = env('PORT', 3000);
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};
