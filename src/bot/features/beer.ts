import { Composer, InlineKeyboard } from "grammy";
import getExternalIP from "../../helpers/getExternalIp";
import { env } from "../../helpers/env";
import { findOrCreate } from "./../../db/models/User";
import { Context } from './../context'

export const beerFeature = new Composer<Context>()
const pBeerFeature = beerFeature.chatType("private");

async function magicButton() {
  const api = await getExternalIP();

  return new InlineKeyboard().webApp(
    "💫 Tap!",
    `${api}:${env.PORT}/index.html`
  );
}

pBeerFeature.command("start", async (ctx) => {
  await ctx.reply("Hello, there!", {
    reply_markup: await magicButton(),
  });
});

pBeerFeature.command("beer", async (ctx) => {
  const user = await findOrCreate(ctx.from!.id.toString());

  if (!user) return;

  await ctx.reply(
    `Your id is: ${user.userId}\nLiters of beer: ${user.litersOfBeer}`
  );
});


pBeerFeature.on(":web_app_data", (ctx) => {
  const data = ctx.message!.web_app_data.data;

  return ctx.reply(data);
});
