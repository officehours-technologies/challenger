import { app } from "app";
import { Application } from "express";
import { initClient } from "mongo/client";

init(app);

async function init(app: Application) {
  await initClient();

  const port = process.env.PORT || 3000;

  app.listen(port);

  console.log(`listening on port ${port}…`);
}
