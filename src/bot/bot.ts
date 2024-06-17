import { Bot, InlineKeyboard } from "grammy";

export const bot = new Bot("2200642691:AAGGJx_0n5cBHgEiHLXH55bnr-Dsb4hGrkw", {
  client: { environment: "test" },
});

const magicButton = new InlineKeyboard().webApp(
  "💫 Tap!",
  "http://172.23.229.98:3000/" + "index.html"
);

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, there!", {
    reply_markup: magicButton,
  });
});

bot.on(":web_app_data", (ctx) => {
  const data = ctx.message!.web_app_data.data;
  console.log('pong')
  return ctx.reply(data);
});

bot.on("message", (ctx) => ctx.reply("Hi, there!"));
