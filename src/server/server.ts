import Koa from "koa";
import serve from "koa-static";
import path from "path";
import Router from "koa-router";
import { transformInitData, validate } from "./../helpers/tgAuth";
import { bot } from "./../bot/bot";
import bodyParser from "koa-bodyparser";
import { env } from "../helpers/env";
import { z } from "zod";

export const app = new Koa();

app.use(bodyParser({}));

const staticDirPath = path.join(__dirname, "../..", "public");
app.use(serve(staticDirPath));

const router = new Router<{}, { initData: { [k: string]: string } }>({
  prefix: "/api",
});

router.use(async (ctx, next) => {
  const data = ctx.request.body as { _auth: string };

  const initData = data._auth;

  if (!initData) return (ctx.status = 400);

  const transformedInitData = transformInitData(initData);
  const isValid = await validate(transformedInitData, env.BOT_TOKEN);

  if (!isValid) return (ctx.status = 403);

  ctx.initData = transformedInitData;

  await next();
});

router.get("/test", async (ctx) => {
  console.log(ctx);
});

const DrinkBeer = z.object({
  liters: z.string(),
});
router.post("/drinkBeer", async (ctx, next) => {
  let data;
  try {
    data = DrinkBeer.parse(ctx.request.body);
  } catch (err) {
    return next();
  }

  await bot.api.answerWebAppQuery(ctx.initData["query_id"], {
    type: "article",
    id: "1",
    title: "Title", // empty
    input_message_content: {
      message_text: `${data.liters}`,
    },
  });
});

app.use(router.routes());
app.use(router.allowedMethods());
