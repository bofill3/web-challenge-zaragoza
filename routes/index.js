// routes/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { exec } = require("child_process");
const {verificarJWT} = require("../middleware/auth");
const{verificarAdminJWT} = require("../middleware/auth")
const fetch = require("node-fetch");
const {launchBot} = require("../bot/bot.js")

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
  console.log("Entrando a la funcion report")
  const { title, description, url } = req.body;

  const newReport = {
    id: 1,
    title,
    description,
    url,
    date: new Date().toISOString().split("T")[0],
  };

  // Sobrescribir el archivo con solo este reporte
  const reports = [newReport];
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

  // Ejecutar el bot
  console.log("Ejecutando Bot")
  launchBot()

  res.redirect("/thanks");
});


// Página de agradecimiento
router.get("/thanks", (req, res) => {
  res.render("thanks", { title: "Gracias | SmartAdmin Zaragoza" });
});

// GET /gallery
router.get("/gallery", (req, res) => {
  const galleryDir = path.join(__dirname, "../data/gallery");
  const files = fs.existsSync(galleryDir) ? fs.readdirSync(galleryDir) : [];

  const images = files.map(filename => ({
    name: filename,
    path: "/dashboard/gallery/" + filename,
  }));

  res.render("gallery", {
    title: "Galería de imágenes | SmartCity Zaragoza",
    images,
  });
});

// GET /gallery/:filename - descarga de imagen
router.get("/gallery/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../data/gallery", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Disposition", `attachment; filename=${req.params.filename}`);
    res.setHeader("Content-Type", "text/plain");
    res.sendFile(filePath);
  } else {
    res.status(404).send("Imagen no encontrada");
  }
});


router.get("/dashboard", verificarAdminJWT, (req,res) => {
  
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

// POST /upload - subir imagen
router.post("/upload", verificarAdminJWT, async (req, res) => {
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

    res.render("upload", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: `Imagen guardada como <strong>${filename}</strong>. Puedes verla en la <a href="/gallery">galería</a>.`,
    });
  } catch (err) {
    res.render("upload", {
      title: "Subir imagen a galería | SmartCity Zaragoza",
      result: `Error al descargar la imagen: ${err.message}`,
    });
  }
});


// Página para validar URLs - GET
router.get("/upload", verificarAdminJWT, (req, res) => {
  res.render("upload", {
    title: "Validar URL | SmartCity Zaragoza",
    result: null,
  });
});


module.exports = router;
