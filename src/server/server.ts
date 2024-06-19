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

  return new Promise<Server>((res, rej) => {
    const connection = app
      .listen(env.PORT)
      .on("listening", () => {
        console.log(`HTTP is listening on ${env.PORT}`);
        res(connection);
      })
      .on("error", rej);
  });
}
