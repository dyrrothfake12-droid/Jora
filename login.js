import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFsWd-NC2wgpBY6Y-5xaup6JqShHtGyiI",
  authDomain: "joradiscoclub.firebaseapp.com",
  projectId: "joradiscoclub",
  storageBucket: "joradiscoclub.firebasestorage.app",
  messagingSenderId: "161653684557",
  appId: "1:161653684557:web:9ae395935efcbb3ad25f04",
  measurementId: "G-DE8XG24SK1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Referencias del DOM
const form = document.getElementById("loginForm");
const popup = document.getElementById("popup");

// Función para mostrar notificaciones
function showPopup(mensaje, tipo = "success") {
  popup.style.display = "block";
  popup.innerHTML = `
    <strong>${tipo === "error" ? "❌ Error" : "✅ Éxito"}</strong>
    ${mensaje}
  `;
  popup.style.color = tipo === "error" ? "#ff4d4d" : "#00ff88";

  // Si es éxito, lanza confetti 🎉
  if (tipo === "success") {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });
  }

  // Ocultar después de unos segundos
  setTimeout(() => (popup.style.display = "none"), 4000);
}

// Evento al enviar formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;

  try {
    // Iniciar sesión con Firebase
    await signInWithEmailAndPassword(auth, email, password);

    // Mostrar éxito
    showPopup("¡Bienvenido! Aquí la única regla es divertirse al máximo 🎉", "success");

    // Redirigir después de unos segundos
    setTimeout(() => {
      window.location.href = "home.html";
    }, 4000);

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);

    // Personalizar mensajes de error
    if (error.code === "auth/user-not-found") {
      showPopup("No existe una cuenta con ese correo.", "error");
    } 
    // Corrigiendo: auth/wrong-password y auth/invalid-credential son muy similares
    // y se deben manejar con el mismo mensaje genérico por seguridad.
    else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      showPopup("Contraseña o correo electrónico incorrecto.", "error"); // Mensaje más seguro
    } 
    else if (error.code === "auth/invalid-email") {
      showPopup("El formato del correo no es válido.", "error");
    } else if (error.code === "auth/too-many-requests") {
      showPopup("Demasiados intentos fallidos. Intenta más tarde.", "error");
    } else {
      showPopup("Ocurrió un error: " + error.message, "error");
    }
  }
});
