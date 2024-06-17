import { bot } from "./bot/bot";
import { app } from "./server/server";

bot.start({
  onStart: (botInfo) => console.log(`${botInfo.username} is up and running!`),
});

app.listen(3000, () => console.log("Server is up and running!"));
