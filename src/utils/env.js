import dotenv from 'dotenv';

dotenv.config();

export const env = (name, defaultName) => {
  const variableToReturn = process.env[name];
  if (variableToReturn) return variableToReturn;
  if (defaultName) return defaultName;
  throw new Error(`The variable with name ${name} doesn't exist in the env`);
};
