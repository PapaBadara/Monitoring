const express = require("express");
const client = require("prom-client");

const app = express();
const port = 3000;

// 🔹 Création du registre
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// 🔹 Compteur HTTP
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

register.registerMetric(httpRequestCounter);

// 🔹 Route principale
app.get("/", (req, res) => {
  httpRequestCounter.inc({ method: "GET", route: "/", status: 200 });
  res.send(
    "🚀 Hello from Node.js app deployed on Kubernetes cluster! with monitoring",
  );
});

// 🔹 Route metrics (IMPORTANT)
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.post("/login", (req, res) => {
  httpRequestCounter.inc({
    method: "POST",
    route: "/login",
    status: 200,
  });

  res.send("Login successful");
});
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
