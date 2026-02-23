// install.js

let deferredPrompt;
const installDiv = document.getElementById('install');
const installBtn = document.getElementById('install-btn');

export function initInstallPrompt() {
  // 1. On cache le bouton par défaut (optionnel si déjà fait en CSS)
  installDiv.classList.add('hidden');

  // 2. On écoute l'événement du navigateur
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêche Chrome 67 et versions antérieures d'afficher l'invite automatiquement
    e.preventDefault();
    // On stocke l'événement pour l'utiliser plus tard
    deferredPrompt = e;
    // On affiche notre div de promotion d'installation
    installDiv.classList.remove('hidden');
  });

  // 3. Gestion du clic sur le bouton
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    // Affiche la boîte de dialogue d'installation native
    deferredPrompt.prompt();

    // Attend la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Réponse de l'utilisateur : ${outcome}`);

    // On réinitialise la variable, elle ne peut servir qu'une fois
    deferredPrompt = null;

    // On cache à nouveau le bouton
    installDiv.classList.add('hidden');
  });

  // 4. On cache le bouton si l'app est déjà installée
  window.addEventListener('appinstalled', () => {
    installDiv.classList.add('hidden');
    deferredPrompt = null;
    console.log('L\'application a été installée avec succès !');
  });
}