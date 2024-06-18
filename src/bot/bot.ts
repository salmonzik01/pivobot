import { Bot, InlineKeyboard } from "grammy";
import { env } from "./../helpers/env";
import { findOrCreate } from "../db/models/User";
import getWSLIp from "../helpers/getWSLIp";

export const bot = new Bot(env.BOT_TOKEN, {
  client: { environment: env.DEPLOYMENT_TYPE },
});

async function magicButton() {
  const api = await getWSLIp();
  return new InlineKeyboard().webApp("💫 Tap!", api + "index.html");
}

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, there!", {
    reply_markup: await magicButton(),
  });
});

bot.command("beer", async (ctx) => {
  const user = await findOrCreate(ctx.from!.id.toString());

  if (!user) return;

  await ctx.reply(
    `Your id is: ${user.userId}\nLiters of beer: ${user.litersOfBeer}`
  );
});

bot.command("add_beer", async (ctx) => {
  const user = await findOrCreate(ctx.from!.id.toString());

  if (!user) return;

  user.litersOfBeer! += 1;
  await user.save();

  await ctx.reply("You successful drank a liter of beer");
});

bot.on(":web_app_data", (ctx) => {
  const data = ctx.message!.web_app_data.data;
  console.log("pong");
  return ctx.reply(data);
});

bot.on("message", (ctx) => ctx.reply("Hi, there!"));
