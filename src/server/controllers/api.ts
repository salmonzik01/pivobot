import { Body, Controller, Ctx, Post } from "amala";
import { Context } from "koa";
import DrinkBeer from "../validators/drinkBeer";
import { bot } from "./../../bot/bot";

@Controller("/api")
export default class ApiController {
  @Post("/drinkBeer")
  async drinkBeer(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: DrinkBeer
  ) {
    await bot.api.answerWebAppQuery(ctx["initData"]["query_id"], {
      type: "article",
      id: "1",
      title: "Title", // empty
      input_message_content: {
        message_text: `${body.liters}`,
      },
    });
  }

  @Post("/test")
  async test(/*@Ctx() ctx: Context*/) {
    console.log('test successfull')
  }
}
