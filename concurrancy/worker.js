import { parentPort } from "node:worker_threads";

parentPort.on("message", (message) => {
  console.log(message);
  const start = Date.now();

  while (Date.now() - start < 3000) {
    // Keep JavaScript busy for 3 seconds
  }

  parentPort.postMessage({ status: "success", duration: "3 seconds" });
});
