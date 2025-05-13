require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const logger = require("morgan")

const app = express()
const PORT = process.env.PORT || 3000

// Configuración de vistas
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layout")

// Middleware
app.use(logger("dev"))
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// Rutas
const indexRoutes = require("./routes/index")
const adminRoutes = require("./routes/admin")
const authRoutes = require('./routes/auth');


app.use('/', authRoutes);
app.use("/", indexRoutes)
app.use("/admin", adminRoutes)

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render("error", {
    title: "Página no encontrada | SmartAdmin Zaragoza",
    message: "La página que estás buscando no existe.",
    error: { status: 404 },
  })
})

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).render("error", {
    title: "Error | SmartAdmin Zaragoza",
    message: err.message,
    error: app.get("env") === "development" ? err : {},
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Servidor SmartAdmin Zaragoza escuchando en http://localhost:${PORT}`)
})
