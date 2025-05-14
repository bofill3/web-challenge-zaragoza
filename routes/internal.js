const express = require("express");
const fs = require("fs");
const path = require("path");
const internalRouter = express.Router();

internalRouter.get("/flag", (req, res) => {
  const ip = req.socket.remoteAddress;

  // Permitir solo desde localhost
  if (!ip.includes("127.0.0.1") && ip !== "::1") {
    return res.status(403).send("Acceso denegado");
  }

  const flagPath = path.join(__dirname, "..", "data", "flag.txt");

  if (!fs.existsSync(flagPath)) {
    return res.status(500).send("Flag no encontrada");
  }

  const flag = fs.readFileSync(flagPath, "utf-8");
  res.send(flag);
});

module.exports = internalRouter;
