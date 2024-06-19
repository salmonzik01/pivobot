import { Bot, InlineKeyboard } from "grammy";
import { env } from "./../helpers/env";
import { beerFeature } from "./features/beer";
import { type Context } from "./context";

export const bot = new Bot<Context>(env.BOT_TOKEN, {
  client: { environment: env.DEPLOYMENT_TYPE },
});

bot.use(beerFeature);

bot.on("message", (ctx) => ctx.reply("I don't understand you, try /start"));
