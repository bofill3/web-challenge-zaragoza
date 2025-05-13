// routes/index.js
const express = require("express")
const router = express.Router()

// Página de inicio
router.get("/", (req, res) => {
  res.render("index", { title: "Inicio | SmartAdmin Zaragoza" })
})

// Página para reportar incidencias - GET
router.get("/report", (req, res) => {
  res.render("reports", { title: "Reportar Incidencia | SmartAdmin Zaragoza" })
})

// Procesar el formulario de reporte - POST
router.post("/report", (req, res) => {
  // Obtener los datos del formulario
  const { title, description, url } = req.body

  // Aquí normalmente guardarías los datos en una base de datos
  // Por ahora, solo simulamos que se ha guardado correctamente
  console.log("Nueva incidencia reportada:", { title, description, url })

  // Redirigir a la página de agradecimiento
  res.redirect("/thanks")
})

// Página de agradecimiento después de enviar un reporte
router.get("/thanks", (req, res) => {
  res.render("thanks", { title: "Gracias | SmartAdmin Zaragoza" })
})

module.exports = router
