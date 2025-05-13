// Funcionalidad para mejorar la experiencia de usuario
document.addEventListener("DOMContentLoaded", () => {
  // Animación suave para los elementos de la página
  const animateElements = document.querySelectorAll(".hero, .feature, .card")

  animateElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, 100 * index)
  })

  // Validación de formularios
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const requiredFields = form.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.classList.add("error")

          // Crear mensaje de error si no existe
          let errorMsg = field.parentNode.querySelector(".error-message")
          if (!errorMsg) {
            errorMsg = document.createElement("div")
            errorMsg.className = "error-message"
            errorMsg.textContent = "Este campo es obligatorio"
            field.parentNode.appendChild(errorMsg)
          }
        } else {
          field.classList.remove("error")
          const errorMsg = field.parentNode.querySelector(".error-message")
          if (errorMsg) {
            errorMsg.remove()
          }
        }
      })

      if (!isValid) {
        event.preventDefault()
      }
    })
  })

  // Añadir estilos a los campos de formulario al enfocar
  const formInputs = document.querySelectorAll("input, textarea")

  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentNode.classList.add("focused")
    })

    input.addEventListener("blur", function () {
      this.parentNode.classList.remove("focused")
    })
  })
})
