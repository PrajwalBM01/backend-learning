import { app } from "./app";
import { env } from "./config/env";

const port = env.PORT;

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
