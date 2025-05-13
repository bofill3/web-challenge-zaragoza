const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const url = require("url");
const verificarJWT = require('../middleware/auth');

const REPORTS_FILE = path.join(__dirname, "../data/reports.json");

// Utilidad para cargar los reportes desde el JSON
function loadReports() {
  if (fs.existsSync(REPORTS_FILE)) {
    return JSON.parse(fs.readFileSync(REPORTS_FILE));
  }
  return [];
}

// Panel de administración - Ver todas las incidencias
router.get("/", verificarJWT, (req, res) => {
  const reports = loadReports();
  res.render("admin_logs", {
    title: "Panel de Administración | SmartCity Zaragoza",
    reports,
  });
});

// Página para validar URLs - GET
router.get("/validate", verificarJWT, (req, res) => {
  res.render("validate", {
    title: "Validar URL | SmartCity Zaragoza",
    result: null,
  });
});

// Procesar la validación de URL - POST
router.post("/validate", verificarJWT, (req, res) => {
  const { url: urlToValidate } = req.body;

  if (!urlToValidate || !urlToValidate.startsWith("http")) {
    return res.render("validate", {
      title: "Validar URL | SmartCity Zaragoza",
      result: "Error: La URL debe comenzar con http:// o https://",
    });
  }

  const parsedUrl = url.parse(urlToValidate);

  const result = `
URL: ${urlToValidate}
Protocolo: ${parsedUrl.protocol}
Dominio: ${parsedUrl.hostname}
Ruta: ${parsedUrl.pathname || "/"}
Status: 200 OK (simulado)
Content-Type: text/html; charset=UTF-8 (simulado)
Server: Apache/2.4.41 (simulado)
  `;

  res.render("validate", {
    title: "Validar URL | SmartCity Zaragoza",
    result: result,
  });
});

// Ver detalle de una incidencia
router.get("/report/:id", verificarJWT, (req, res) => {
  const reportId = Number.parseInt(req.params.id);
  const reports = loadReports();
  const report = reports.find((r) => r.id === reportId);

  if (!report) {
    return res.status(404).send("Incidencia no encontrada");
  }

  res.render("report_detail", {
    title: `Incidencia #${reportId} | SmartCity Zaragoza`,
    report: report,
  });
});

// Cambiar estado de incidencia
router.post("/report/:id/status", verificarJWT, (req, res) => {
  const reportId = Number.parseInt(req.params.id);
  const { status } = req.body;
  const reports = loadReports();
  const reportIndex = reports.findIndex((r) => r.id === reportId);

  if (reportIndex === -1) {
    return res.status(404).send("Incidencia no encontrada");
  }

  // Actualizar el estado
  reports[reportIndex].status = status;
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

  res.redirect("/admin");
});

module.exports = router;
