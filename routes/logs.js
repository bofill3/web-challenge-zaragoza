const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const url = require("url");
const {verificarJWT} = require('../middleware/auth');
const fetch = require("node-fetch");

const REPORTS_FILE = path.join(__dirname, "../data/reports.json");

// Utilidad para cargar los reportes desde el JSON
function loadReports() {
  if (fs.existsSync(REPORTS_FILE)) {
    return JSON.parse(fs.readFileSync(REPORTS_FILE));
  }
  return [];
}

// Panel de logs - Ver todas las incidencias
router.get("/", verificarJWT, (req, res) => {
  const reports = loadReports();
  res.render("admin_logs", {
    title: "Registro Incidencias para Trabajadores | SmartCity Zaragoza",
    reports,
  });
});





module.exports = router;
