// routes/admin.js
const express = require("express")
const router = express.Router()
const { exec } = require("child_process")
const url = require("url")
const verificarJWT = require('../middleware/auth');

// Simulación de base de datos de reportes
const reports = [
  {
    id: 1,
    title: "Farola sin luz en Calle Delicias",
    description: "La farola de la esquina lleva tres días sin funcionar, generando inseguridad por la noche.",
    url: "https://example.com/imagen1.jpg",
    date: "2025-05-10",
  },
  {
    id: 2,
    title: "Banco roto en Parque Grande",
    description: "Uno de los bancos del paseo principal tiene varias tablas rotas que pueden ser peligrosas.",
    url: "",
    date: "2025-05-09",
  },
  {
    id: 3,
    title: "Contenedor de reciclaje dañado",
    description: "El contenedor azul de papel está roto y no se puede abrir correctamente.",
    url: "https://example.com/imagen2.jpg",
    date: "2025-05-08",
  },
]



// Panel de administración - Ver todas las incidencias
router.get("/", verificarJWT, (req, res) => {
  res.render("admin_logs", {
    title: "Panel de Administración | SmartCity Zaragoza",
    reports: reports,
  })
})

// Página para validar URLs - GET
router.get("/validate", verificarJWT, (req, res) => {
  res.render("validate", {
    title: "Validar URL | SmartCity Zaragoza",
    result: null,
  })
})

// Procesar la validación de URL - POST
router.post("/validate", verificarJWT, (req, res) => {
  const { url: urlToValidate } = req.body

  // Validación básica de la URL
  if (!urlToValidate || !urlToValidate.startsWith("http")) {
    return res.render("validate", {
      title: "Validar URL | SmartCity Zaragoza",
      result: "Error: La URL debe comenzar con http:// o https://",
    })
  }

  // Parsear la URL para obtener información
  const parsedUrl = url.parse(urlToValidate)

  // Simulación de validación (en una aplicación real, harías una verificación más completa)
  const result = `
URL: ${urlToValidate}
Protocolo: ${parsedUrl.protocol}
Dominio: ${parsedUrl.hostname}
Ruta: ${parsedUrl.pathname || "/"}
Status: 200 OK (simulado)
Content-Type: text/html; charset=UTF-8 (simulado)
Server: Apache/2.4.41 (simulado)
  `

  res.render("validate", {
    title: "Validar URL | SmartCity Zaragoza",
    result: result,
  })
})

// Ruta para ver detalles de una incidencia específica
router.get("/report/:id", verificarJWT, (req, res) => {
  const reportId = Number.parseInt(req.params.id)
  const report = reports.find((r) => r.id === reportId)

  if (!report) {
    return res.status(404).send("Incidencia no encontrada")
  }

  res.render("report_detail", {
    title: `Incidencia #${reportId} | SmartCity Zaragoza`,
    report: report,
  })
})

// Ruta para cambiar el estado de una incidencia (simulado)
router.post("/report/:id/status", verificarJWT, (req, res) => {
  const reportId = Number.parseInt(req.params.id)
  const { status } = req.body

  const reportIndex = reports.findIndex((r) => r.id === reportId)

  if (reportIndex === -1) {
    return res.status(404).send("Incidencia no encontrada")
  }

  // Actualizar el estado (en una aplicación real, actualizarías la base de datos)
  reports[reportIndex].status = status

  res.redirect("/admin")
})

module.exports = router
