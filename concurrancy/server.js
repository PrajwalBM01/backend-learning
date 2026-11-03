import express from "express";
import { monitorEventLoopDelay } from "node:perf_hooks";
import { Worker } from "node:worker_threads";

const app = express();
const h = monitorEventLoopDelay({ resolution: 20 });
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

h.enable();

setInterval(() => {
  const p99 = h.percentile(99);
  const p99Ms = p99 / 1e6;
  //   console.log(`p99 Event Loop Delay: ${p99Ms.toFixed(4)} ms`);
  h.reset();
}, 1000);

const port = 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/slow-cpu", (req, res) => {
  const worker = new Worker("./worker.js");

  worker.postMessage({ start: true });

  worker.on("message", (result) => {
    res.json({
      message: "CPU-intensive task completed by worker",
      data: result,
    });
    worker.terminate();
  });

  worker.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });
});

app.get("/slow-cpu2", (req, res) => {
  const start = Date.now();

  while (Date.now() - start < 3000) {
    // Keep JavaScript busy for 3 seconds
  }

  res.send("CPU work finished");
});

app.get("/slow-db", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  res.send("Database wait finished");
});

app.listen(port, () => {
  console.log("server running");
});
