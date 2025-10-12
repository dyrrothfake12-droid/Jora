// Importar Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Configuración de Firebase
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

// Referencias al formulario y popup
const form = document.getElementById('loginForm');
const popup = document.getElementById('popup');

// Función para mostrar notificaciones flotantes
function showPopup(message, type = "success") {
  popup.innerHTML = `
    <strong>${type === "success" ? "✅ Éxito" : "⚠️ Error"}</strong><br>
    ${message}
  `;
  popup.style.background = type === "success" ? "#2ecc71" : "#e74c3c";
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 4000);
}

// Evento de envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form['email'].value;
  const password = form['password'].value;

  try {
    // Intentar iniciar sesión
    await signInWithEmailAndPassword(auth, email, password);

    // Mostrar popup de éxito
    showPopup("¡Bienvenido de nuevo a la fiesta!", "success");

    // 🎉 Confeti
    if (typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    }

    // Redirigir después de unos segundos
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 4000);

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);

    // Personalizar mensajes de error
    if (error.code === "auth/user-not-found") {
      showPopup("No existe una cuenta con ese correo.", "error");
    } else if (error.code === "auth/wrong-password") {
      showPopup("Contraseña incorrecta. Inténtalo de nuevo.", "error");
    } else if (error.code === "auth/invalid-email") {
      showPopup("El formato del correo no es válido.", "error");
    } else {
      showPopup("Ocurrió un error: " + error.message, "error");
    }
  }
});
