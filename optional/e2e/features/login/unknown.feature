#language: fr

@admin
Fonctionnalité: Page de login pour profil admin
  Pour pouvoir découvrir la Sample Next App
  En tant que admin
  Je veux pouvoir me connecter via la page de login

Scénario:

  # Je me rends sur la page de login
  Soit un navigateur web sur le site
  Quand je clique sur "login"
  Alors je suis redirigé vers la page: "/login"

  # Je me connecte en tant qu'inconnu
  Soit un utilisateur connecté avec le profil "unknown"
  Alors je vois "Impossible de vous authentifier"
