import { Body, Controller, Ctx, Get, Post } from "amala";
import { Context } from "koa";
import DrinkBeer from "../validators/drinkBeer";
import { findOrCreate } from "./../../db/models/User";

@Controller("/api")
export default class ApiController {
  @Post("/drinkBeer")
  async drinkBeer(
    @Ctx() ctx: Context,
    @Body({ required: true }) body: DrinkBeer
  ) {
    const user = await findOrCreate(JSON.parse(ctx["initData"].user).id);

    user.litersOfBeer += parseInt(body.liters);
    user.save();

    // await bot.api.answerWebAppQuery(ctx["initData"]["query_id"], {
    //   type: "article",
    //   id: "1",
    //   title: "Title", // empty
    //   input_message_content: {
    //     message_text: `${body.liters}`,
    //   },
    // });
  }

  @Post("/getUser")
  async getUser(@Ctx() ctx: Context) {
    const user = await findOrCreate(JSON.parse(ctx["initData"].user).id);

    return user;
  }
}
