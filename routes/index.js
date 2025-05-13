// routes/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { exec } = require("child_process");

const REPORTS_FILE = path.join(__dirname, "../data/reports.json");

// Página de inicio
router.get("/", (req, res) => {
  res.render("index", { title: "Inicio | SmartCity Zaragoza" });
});

// Página para reportar incidencias - GET
router.get("/report", (req, res) => {
  res.render("reports", { title: "Reportar Incidencia | SmartCity Zaragoza" });
});

// Procesar el formulario de reporte - POST
router.post("/report", (req, res) => {
  const { title, description, url } = req.body;

  // Cargar incidencias previas
  let reports = [];
  if (fs.existsSync(REPORTS_FILE)) {
    reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  }

  // Crear nueva incidencia
  const newReport = {
    id: reports.length + 1,
    title,
    description, // se mantiene sin sanitizar para permitir XSS
    url,
    date: new Date().toISOString().split("T")[0],
  };

  // Guardar en archivo
  reports.push(newReport);
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

  // Ejecutar el bot
  exec("node bot/bot.js", (err, stdout, stderr) => {
    if (err) {
      console.error("[ERROR BOT]:", err);
      return;
    }
    console.log("[BOT OUTPUT]:", stdout);
  });

  res.redirect("/thanks");
});

// Página de agradecimiento
router.get("/thanks", (req, res) => {
  res.render("thanks", { title: "Gracias | SmartAdmin Zaragoza" });
});

module.exports = router;
