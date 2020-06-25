#language: fr

@home
Fonctionnalité: Page d'accueil
  Pour pouvoir découvrir la Sample Next App
  En tant que visiteur
  Je veux pouvoir consulter la page d'accueil

Scénario:

  # Je me rends sur la home page
  Soit un navigateur web sur le site
  Alors je vois "Hello, SocialGouv!"

  # Je vais sur la page 2
  Quand je clique sur "Go to page 2"
  Alors je suis redirigé vers la page: "/page2"

  # Je reviens sur la home page
  Quand je clique sur "sample-next-app"
  Alors je suis redirigé vers la page: "/"
