import Koa from "koa";
import serve from "koa-static";
import path from "path";
import Router from "koa-router";
import { transformInitData, validate } from "./../helpers/tgAuth";
import { bot } from "./../bot/bot";
import bodyParser from "koa-bodyparser";
import { env } from "../helpers/env";

export const app = new Koa();

app.use(bodyParser({}));

const staticDirPath = path.join(__dirname, "../..", "public");
app.use(serve(staticDirPath));

const router = new Router();

router.post("/api/sendAnswer", async (ctx, next) => {
  const data = ctx.request.body as { _auth: string, result: number };
  const COUNT_OF_QUESTIONS = 3;

  // If has not auth data - send Bad Request
  let initData = data._auth;
  if (!initData) {
    ctx.status = 400;
    return next();
  }

  // Check authorization with Telegram
  let transfromedInitData = transformInitData(initData);
  const isValid = await validate(transfromedInitData, env.BOT_TOKEN);
  if (!isValid) {
    ctx.status = 403;
    return next();
  }

  console.log(1)
  // Reply to user
  await bot.api.answerWebAppQuery(transfromedInitData['query_id'], {
    type: "article",
    id: "1",
    title: "Title", // empty
    input_message_content: {
      message_text: `Right answers: ${data.result} of ${COUNT_OF_QUESTIONS}`,
    },
  });
  console.log(2)

  ctx.status = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());
