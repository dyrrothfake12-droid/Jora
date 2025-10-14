import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔥 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFsWd-NC2wgpBY6Y-5xaup6JqShHtGyiI",
  authDomain: "joradiscoclub.firebaseapp.com",
  projectId: "joradiscoclub",
  storageBucket: "joradiscoclub.firebasestorage.app",
  messagingSenderId: "161653684557",
  appId: "1:161653684557:web:9ae395935efcbb3ad25f04",
  measurementId: "G-DE8XG24SK1"
};

// 🚀 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🧩 Función para mostrar notificaciones
function showPopup(message, type = "success") {
  const popup = document.getElementById('popup');
  popup.innerHTML = `
    <strong>${type === "success" ? "✅ Registro exitoso" : "⚠️ Error"}</strong><br>
    ${message}
  `;
  popup.style.background = type === "success" ? "#32cc2cff" : "#e74c3c";
  popup.style.display = 'block';
  setTimeout(() => popup.style.display = 'none', 4000);
}

// 🧠 Generar token aleatorio
function generarToken(longitud = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: longitud }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// 🆔 Generar ID único para el usuario
function generarIdUnico() {
  return 'JORA-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// 🔳 Generar QR único usando API pública
function generarQrUrl(idUnico) {
  const data = `https://joradiscoclub.com/recargar?id=${idUnico}`; 
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
}

// 📝 Evento de registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target['email'].value;
  const password = e.target['password'].value;
  const nombre = e.target['nombre'].value;
  const celular = e.target['telefono'].value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generar datos adicionales
    const token = generarToken();
    const idUnico = generarIdUnico();
    const qrUrl = generarQrUrl(idUnico);

    // Guardar datos en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre,
      email,
      celular,
      tokenSaldo: 0, // saldo inicial de tokens
      token,
      idUnico,
      qrUrl,
      creado: new Date()
    });

    showPopup("¡Bienvenido a Jora Discoteck! Tu cuenta fue creada exitosamente.", "success");

    // Confeti 🎉
    if (typeof confetti === "function") {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }

    setTimeout(() => window.location.href = "login.html", 4000);

  } catch (error) {
    console.error("❌ Error en el registro:", error);
    if (error.code === "auth/email-already-in-use") {
      showPopup("El correo ya está en uso.", "error");
    } else if (error.code === "auth/weak-password") {
      showPopup("Contraseña demasiado débil.", "error");
    } else {
      showPopup(error.message, "error");
    }
  }
});
