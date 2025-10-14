
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, onSnapshot, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // Establecer nivel de log de Firebase
        setLogLevel('Debug');

        // 1. Configuración e Inicialización de Firebase (USANDO VARIABLES GLOBALES MANDATORIAS)
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        if (!firebaseConfig) {
            console.error("Firebase config no está disponible. No se puede inicializar.");
            document.getElementById('loading-message').textContent = "Error: Configuración de Firebase no encontrada.";
            // Si la configuración no existe, salimos del script
            return; 
        }

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Variables de la UI
        const qrCodeImg = document.getElementById('qr-code-img');
        const userIdDisplay = document.getElementById('user-id-display');
        const tokenBalanceDisplay = document.getElementById('token-balance-display');
        const headerTokenDisplay = document.getElementById('header-token-display');
        const userNameDisplay = document.getElementById('user-name-display');
        const userEmailDisplay = document.getElementById('user-email-display');
        const loadingMessage = document.getElementById('loading-message');

        /**
         * Genera la URL del QR basado en el UID del usuario.
         * @param {string} uid El ID de usuario (UID) de Firebase.
         * @returns {string} URL para la imagen del QR.
         */
        function generateQrCodeUrl(uid) {
            // Se usa una API de terceros para generar el QR.
            // La data que contiene el QR es el UID único del usuario.
            const qrData = `JoraDiscoteck_UID_${uid}`;
            return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
        }

        /**
         * Carga los datos de perfil y establece el listener en tiempo real (onSnapshot).
         * @param {string} userId El ID de usuario actual.
         */
        function loadUserProfile(userId) {
            // 1. Generar y mostrar el QR
            qrCodeImg.src = generateQrCodeUrl(userId);
            qrCodeImg.style.display = 'block';
            userIdDisplay.textContent = userId;

            // 2. Establecer listener en Firestore para datos en tiempo real (tokens, nombre, email)
            // Se asume la colección y estructura de datos privada:
            // /artifacts/{appId}/users/{userId}/user_data/profile
            const profileDocRef = doc(db, 'artifacts', appId, 'users', userId, 'user_data', 'profile');

            const unsubscribe = onSnapshot(profileDocRef, (docSnapshot) => {
                if (loadingMessage) loadingMessage.style.display = 'none';

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    
                    // Actualizar Balance de Tokens
                    const tokens = data.tokens || 0;
                    tokenBalanceDisplay.textContent = tokens;
                    headerTokenDisplay.textContent = `TOKENS: ${tokens}`;

                    // Actualizar Datos Personales
                    userNameDisplay.textContent = data.name || 'Sin Nombre';
                    userEmailDisplay.textContent = data.email || 'N/A';
                    
                } else {
                    console.warn("Documento de perfil no encontrado. Creando uno por defecto...");
                    // En un caso real, se debería crear el documento aquí si no existe
                    // Ejemplo de creación de documento inicial (Solo si es un usuario nuevo)
                    
                    // setDoc(profileDocRef, { 
                    //     name: 'Usuario Nuevo',
                    //     email: auth.currentUser?.email || 'anonimo@jora.com',
                    //     tokens: 10 // Regalo de bienvenida
                    // });

                    tokenBalanceDisplay.textContent = '0';
                    userNameDisplay.textContent = 'Perfil Vacío';
                    userEmailDisplay.textContent = 'Sin Datos';
                }
            }, (error) => {
                console.error("Error al escuchar el perfil:", error);
                document.getElementById('loading-message').textContent = `Error: ${error.message}`;
            });

            // En una aplicación real, se usaría la función de retorno de unsubscribe
            // para detener el listener cuando el componente se destruye.
            return unsubscribe;
        }

        // 3. Autenticación y Carga Inicial
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // El usuario está autenticado (o ya se autenticó con el token inicial)
                loadUserProfile(user.uid);
            } else {
                // Intentar autenticar con el token inicial o anónimamente
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                        // onAuthStateChanged se disparará de nuevo con el usuario
                    } else {
                        // Si no hay token inicial, iniciar sesión anónimamente para tener un UID
                        const anonUser = await signInAnonymously(auth);
                        loadUserProfile(anonUser.user.uid);
                    }
                } catch (error) {
                    console.error("Error en la autenticación:", error);
                    document.getElementById('loading-message').textContent = "Error de autenticación. Intente iniciar sesión.";
                }
            }
        });