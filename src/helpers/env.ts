import dotenv from 'dotenv'
import { cleanEnv, port, str, num } from "envalid";

dotenv.config();
export const env = cleanEnv(process.env, {
  DEPLOYMENT_TYPE: str({ choices: ["test", "prod"] }),
  BOT_TOKEN: str(),
  DATABASE_URL: str(),
  PORT: num(),
});
