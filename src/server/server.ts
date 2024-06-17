import Koa from "koa";
import serve from "koa-static";
import path, { resolve } from "path";
import Router from "koa-router";
import { transformInitData, validate } from "./../helpers/tgAuth";
import bodyParser from "koa-bodyparser";
import { env } from "../helpers/env";
import cors from "@koa/cors";
import { bootstrapControllers } from "amala";
import { Server } from "http";

const app = new Koa<{}, { initData: { [k: string]: string } }>();

export default async function runServer() {
  const router = new Router();

  await bootstrapControllers({
    // @ts-ignore
    app,
    basePath: "/",
    controllers: [resolve(__dirname, "./controllers/*")],
    disableVersioning: true,
    router,
  });

  app.use(cors({ origin: "*" }));
  app.use(bodyParser());

  const staticDirPath = path.join(__dirname, "../..", "public");
  app.use(serve(staticDirPath));

  app.use(async (ctx, next) => {
    const data = ctx.request.body as { _auth: string };

    const initData = data._auth;

    if (!initData) return (ctx.status = 400);

    const transformedInitData = transformInitData(initData);
    const isValid = await validate(transformedInitData, env.BOT_TOKEN);

    if (!isValid) return (ctx.status = 403);

    ctx.initData = transformedInitData;

    await next();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return new Promise<Server>((resolve, reject) => {
    const connection = app
      .listen(env.PORT)
      .on("listening", () => {
        console.log(`HTTP is listening on ${env.PORT}`);
        resolve(connection);
      })
      .on("error", reject);
  });
}

// app.use(bodyParser({}));

// const staticDirPath = path.join(__dirname, "../..", "public");
// app.use(serve(staticDirPath));

// const router = new Router<{}, { initData: { [k: string]: string } }>({
//   prefix: "/api",
// });

// router.use(async (ctx, next) => {
//   const data = ctx.request.body as { _auth: string };

//   const initData = data._auth;

//   if (!initData) return (ctx.status = 400);

//   const transformedInitData = transformInitData(initData);
//   const isValid = await validate(transformedInitData, env.BOT_TOKEN);

//   if (!isValid) return (ctx.status = 403);

//   ctx.initData = transformedInitData;

//   await next();
// });

// router.get("/test", async (ctx) => {
//   console.log(ctx);
// });

// const DrinkBeer = z.object({
//   liters: z.string(),
// });
// router.post("/drinkBeer", async (ctx, next) => {
//   let data;
//   try {
//     data = DrinkBeer.parse(ctx.request.body);
//   } catch (err) {
//     return next();
//   }

//   await bot.api.answerWebAppQuery(ctx.initData["query_id"], {
//     type: "article",
//     id: "1",
//     title: "Title", // empty
//     input_message_content: {
//       message_text: `${data.liters}`,
//     },
//   });
// });

// app.use(router.routes());
// app.use(router.allowedMethods());
