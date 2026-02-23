// ==============================
// Gestion du bouton d'installation PWA
// ==============================

// On stockera ici l'événement d'installation
let deferredPrompt = null;

// On récupère le bouton dans le HTML
const installBtn = document.getElementById('installBtn');

// Si le bouton n'existe pas, on arrête le script
if (!installBtn) {
  console.warn("Bouton #installBtn introuvable");
} else {

  // ==============================
  // 1️⃣ Vérifier si l'app est déjà installée
  // ==============================

  const isInstalled = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // pour iOS

  if (isInstalled()) {
    // Si déjà installée → on cache le bouton
    installBtn.classList.add('hidden');
  }

  // ==============================
  // 2️⃣ Intercepter l'événement d'installation
  // ==============================

  window.addEventListener('beforeinstallprompt', (event) => {
    // Empêche l'affichage automatique de la popup
    event.preventDefault();

    // On sauvegarde l'événement
    deferredPrompt = event;

    // On affiche le bouton
    installBtn.classList.remove('hidden');
  });

  // ==============================
  // 3️⃣ Quand l'utilisateur clique sur le bouton
  // ==============================

  installBtn.addEventListener('click', async () => {

    // Si aucun événement n'a été capturé → on ne fait rien
    if (!deferredPrompt) return;

    // Affiche la popup d'installation
    deferredPrompt.prompt();

    // Attend la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log("✅ Installation acceptée");
    } else {
      console.log("❌ Installation refusée");
    }

    // On réinitialise la variable
    deferredPrompt = null;

    // On cache le bouton
    installBtn.classList.add('hidden');
  });

  // ==============================
  // 4️⃣ Si l'application est installée
  // ==============================

  window.addEventListener('appinstalled', () => {
    console.log("🎉 Application installée !");
    installBtn.classList.add('hidden');
  });
}