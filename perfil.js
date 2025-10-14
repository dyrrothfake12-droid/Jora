import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔥 Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFsWd-NC2wgpBY6Y-5xaup6JqShHtGyiI",
  authDomain: "joradiscoclub.firebaseapp.com",
  projectId: "joradiscoclub",
  storageBucket: "joradiscoclub.firebasestorage.app",
  messagingSenderId: "161653684557",
  appId: "1:161653684557:web:9ae395935efcbb3ad25f04",
  measurementId: "G-DE8XG24SK1"
};

// 🚀 Inicialización
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🧩 Referencias HTML
const qrCodeImg = document.getElementById('qr-code-img');
const userIdDisplay = document.getElementById('user-id-display');
const tokenBalanceDisplay = document.getElementById('token-balance-display');
const headerTokenDisplay = document.getElementById('header-token-display');
const userNameDisplay = document.getElementById('user-name-display');
const userEmailDisplay = document.getElementById('user-email-display');
const loadingMessage = document.getElementById('loading-message');
const logoutBtn = document.getElementById('logout-btn'); // 👈 botón cerrar sesión

// 🧠 Función para cargar datos del perfil
async function loadProfile(uid) {
  try {
    const userRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      userNameDisplay.textContent = data.nombre || "Sin nombre";
      userEmailDisplay.textContent = data.email || "Sin correo";
      tokenBalanceDisplay.textContent = data.tokenSaldo ?? 0;
      headerTokenDisplay.textContent = `TOKENS: ${data.tokenSaldo ?? 0}`;
      userIdDisplay.textContent = data.idUnico || uid;

      // Mostrar QR si existe
      if (data.qrUrl) {
        qrCodeImg.src = data.qrUrl;
        qrCodeImg.style.display = "block";
      }

      loadingMessage.style.display = "none";
    } else {
      loadingMessage.textContent = "No se encontró el perfil del usuario.";
    }
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    loadingMessage.textContent = "Error al cargar los datos.";
  }
}

// 👤 Verificar autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadProfile(user.uid);
  } else {
    loadingMessage.textContent = "Debes iniciar sesión.";
    setTimeout(() => window.location.href = "login.html", 2500);
  }
});

// 🚪 Cerrar sesión con validación
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const confirmar = confirm("¿Seguro que deseas cerrar sesión?");
    if (confirmar) {
      try {
        await signOut(auth);
        alert("Sesión cerrada correctamente 👋");
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("❌ Ocurrió un error al cerrar sesión.");
      }
    }
  });
}
