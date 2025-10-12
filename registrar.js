import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Referencias al DOM
const form = document.getElementById('registerForm');
const popup = document.getElementById('popup');

// Función para mostrar notificaciones personalizadas
function showPopup(message, type = "success") {
  popup.innerHTML = `
    <strong>${type === "success" ? "✅" : "⚠️"} ${type === "success" ? "Registro exitoso" : "Error"}</strong><br>
    ${message}
  `;
  popup.style.background = type === "success" ? "#32cc2cff" : "#e74c3c";
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 4000);
}

// Evento de envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener valores del formulario
  const email = form['email'].value;
  const password = form['password'].value;
  const nombre = form['nombre'].value;
  const celular = form['telefono'].value;

  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre,
      email,
      celular,
      password,
      creado: new Date()
    });

    // Mostrar popup de éxito
    showPopup("¿Listo para bailar toda la noche? ¡Bienvenido a la fiesta!", "success");

    // Confeti 🎉 (si tienes la librería de confetti)
    if (typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }

    // Redirigir después de unos segundos
    setTimeout(() => {
      window.location.href = "login.html";
    }, 4000);

  } catch (error) {
    console.error("❌ Error en el registro:", error.message);

    // Personalizar mensajes de error
    if (error.code === "auth/email-already-in-use") {
      showPopup("El correo ya está en uso. Por favor, usa otro correo electrónico.", "error");
    } else if (error.code === "auth/weak-password") {
      showPopup("La contraseña es demasiado débil. Usa una más segura.", "error");
    } else if (error.code === "auth/invalid-email") {
      showPopup("El formato del correo no es válido.", "error");
    } else {
      showPopup("Ocurrió un error inesperado: " + error.message, "error");
    }
  }
});
