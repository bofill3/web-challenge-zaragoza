const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const url = require("url");
const verificarJWT = require('../middleware/auth');
const fetch = require("node-fetch");

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

// Página para subir imágenes - POST
router.post("/validate", verificarJWT, async (req, res) => {
  const { url: urlToValidate } = req.body;

  if (!urlToValidate || !urlToValidate.startsWith("http")) {
    return res.render("validate", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: "Error: La URL debe comenzar con http:// o https://",
    });
  }

  try {
    const response = await fetch(urlToValidate);
    const buffer = await response.buffer();

    // Guardar como .jpg 
    const filename = `img_${Date.now()}.jpg`;
    const savePath = path.join(__dirname, "../data/gallery", filename);

    fs.writeFileSync(savePath, buffer);

    res.render("validate", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: `Imagen guardada como ${filename}. Puedes verla en la <a href="/admin/gallery">galería</a>.`,
    });
  } catch (err) {
    res.render("validate", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: `Error al descargar la imagen: ${err.message}`,
    });
  }
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


router.get("/dashboard",(req,res) => {
  
  res.render("dashboard",{
    title : "Panel de Administrador | SmartCity Zaragoza",
    stats: {
      total: 24,
      pending: 8,
      inProgress: 10,
      resolved: 6
    },
    reports: [
      {
        id: 1,
        title: "Farola rota en Av. de la Paz",
        date: "15/05/2025",
        status: "pending"
      },
      {
        id: 2,
        title: "Bache en la calle del Coso",
        date: "14/05/2025",
        status: "in-progress"
      },
      {
        id: 3,
        title: "Fuga de agua en la calle Mayor",
        date: "12/05/2025",
        status: "resolved"
      }
    ],
    activities: [
      {
        date: "14/05/2025",
        description: "Se actualizó el estado de 3 incidencias"
      },
      {
        date: "13/05/2025",
        description: "Se añadieron 5 nuevas incidencias al sistema"
      },
      {
        date: "12/05/2025",
        description: "Se resolvieron 2 incidencias pendientes"
      }
    ]
  });
})

// POST /validate
router.post("/validate", async (req, res) => {
  const { url: urlToValidate } = req.body;

  if (!urlToValidate || !urlToValidate.startsWith("http")) {
    return res.render("validate", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: "Error: La URL debe comenzar con http:// o https://",
    });
  }

  try {
    const response = await fetch(urlToValidate);
    const buffer = await response.buffer();

    const filename = `img_${Date.now()}.jpg`;
    const savePath = path.join(__dirname, "../data/gallery", filename);
    fs.writeFileSync(savePath, buffer);

    res.render("validate", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: `Imagen guardada como <strong>${filename}</strong>. Puedes verla en la <a href="/gallery">galería</a>.`,
    });
  } catch (err) {
    res.render("validate", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: `Error al descargar la imagen: ${err.message}`,
    });
  }
});

module.exports = router;
