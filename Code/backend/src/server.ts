import { appConfig } from "./config";
import express from 'express';
import cors from 'cors';
import { router } from "./router";

const app = express();
app.use(cors());
app.use('/v1', router);

const port = appConfig.port || 3000;

app.listen(port, () => {
  console.log(`Wallet app listening at http://localhost:${port}`);
});
