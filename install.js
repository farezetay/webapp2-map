// ========================================
// Gestion du bouton d'installation PWA
// ========================================

// On récupère les éléments HTML
const installContainer = document.getElementById('install');
const installBtn = document.getElementById('installBtn');

// Si les éléments n'existent pas → on arrête tout
if (!installContainer || !installBtn) {
  console.warn("Éléments d'installation introuvables");
} else {

  // Variable pour stocker l'événement d'installation
  let deferredPrompt = null;

  // ========================================
  // 1️⃣ Vérifier si l'application est déjà installée
  // ========================================

  const isAppInstalled = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // nécessaire pour iOS

  if (isAppInstalled()) {
    // Si déjà installée → on cache tout le bloc
    installContainer.classList.add('hidden');
  }

  // ========================================
  // 2️⃣ Capturer l'événement d'installation (Chrome / Android)
  // ========================================

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); // empêche la popup automatique

    deferredPrompt = event; // on sauvegarde l'événement

    // On affiche le bouton
    installBtn.classList.remove('hidden');
    installContainer.classList.remove('hidden');
  });

  // ========================================
  // 3️⃣ Quand l'utilisateur clique sur le bouton
  // ========================================

  installBtn.addEventListener('click', async () => {

    if (!deferredPrompt) return;

    // Affiche la popup d'installation
    deferredPrompt.prompt();

    // Attend la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    console.log("Choix utilisateur :", outcome);

    // On réinitialise
    deferredPrompt = null;

    // On cache le bloc après tentative
    installContainer.classList.add('hidden');
  });

  // ========================================
  // 4️⃣ Quand l'application est installée
  // ========================================

  window.addEventListener('appinstalled', () => {
    console.log("Application installée !");
    installContainer.classList.add('hidden');
  });

}