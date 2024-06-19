import dotenv from "dotenv";
import { cleanEnv, str, num } from "envalid";

dotenv.config();
export const env = cleanEnv(process.env, {
  DEPLOYMENT_TYPE: str({ choices: ["test", "prod"] }),
  ETHERNET_INTERFACE: str({ default: "" }),
  BOT_TOKEN: str(),
  MONGO: str(),
  PORT: num()
});
