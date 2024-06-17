import { bot } from "./bot/bot";
import runServer from "./server/server";
import runMongo from "./db/mongo";

(async () => {
  await runMongo();
  console.log("Mongo is up and running!");

  bot.start({
    onStart: (botInfo) => console.log(`${botInfo.username} is up and running!`),
  });

  await runServer();
})();
