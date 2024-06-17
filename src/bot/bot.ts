import { Bot, InlineKeyboard } from "grammy";
import { env } from "./../helpers/env";

export const bot = new Bot(env.BOT_TOKEN, {
  client: { environment: env.DEPLOYMENT_TYPE },
});

const magicButton = new InlineKeyboard().webApp(
  "💫 Tap!",
  "http://172.23.229.98:3000/" + "index.html" // Поменять на свою ссылку
);

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, there!", {
    reply_markup: magicButton,
  });
});

bot.on(":web_app_data", (ctx) => {
  const data = ctx.message!.web_app_data.data;
  console.log("pong");
  return ctx.reply(data);
});

bot.on("message", (ctx) => ctx.reply("Hi, there!"));
