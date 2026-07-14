import { env } from "./config/env";
import { app } from "./app";

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
