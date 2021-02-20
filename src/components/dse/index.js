import React from "react";

export const SkipLinks = () => (
  <div className="rf-skiplinks">
    <div className="rf-container">
      <ul className="rf-skiplinks__list">
        <li>
          <a className="rf-link" href="#contenu">
            Accéder au contenu
          </a>
        </li>
        <li>
          <a className="rf-link" href="#header-navigation">
            Accéder au menu
          </a>
        </li>
        <li>
          <a className="rf-link" href="#header-search">
            Accéder à la recherche
          </a>
        </li>
        <li>
          <a className="rf-link" href="#footer">
            Accéder au footer
          </a>
        </li>
      </ul>
    </div>
  </div>
);

export const NavBar = () => (
  <div className="rf-header__navbar">
    <div className="rf-service">
      <a className="rf-service__title" href="/" title="<%= appName %>">
        AppName
      </a>
      <p className="rf-service__tagline">AppDescription</p>
    </div>
  </div>
);

export const Nav = () => (
  <nav
    className="rf-nav"
    role="navigation"
    aria-label="Menu principal"
    id="header-navigation"
  >
    <ul className="rf-nav__list">
      <li className="rf-nav__item <% if (page === '/') { %> rf-nav__item--active <% } %>">
        <a className="rf-link" href="/" target="_self">
          Accueil
        </a>
      </li>
      <li className="rf-nav__item <% if (page === '/components') { %> rf-nav__item--active <% } %>">
        <a className="rf-link" href="/components" target="_self">
          Des composants
        </a>
      </li>
      <li className="rf-nav__item <% if (page === '/formulaire') { %> rf-nav__item--active <% } %>">
        <a className="rf-link" href="/formulaire" target="_self">
          Un formulaire
        </a>
      </li>
      <li className="rf-nav__item <% if (page === '/colors') { %> rf-nav__item--active <% } %>">
        <button
          className="rf-btn"
          aria-expanded="false"
          aria-controls="rf-nav-colors"
        >
          Des couleurs
        </button>
        <div className="rf-menu rf-collapse" id="rf-nav-colors">
          <ul className="rf-menu__list">
            <li className="rf-menu__item">
              <a className="rf-link" href="/colors" target="_self">
                Palette de couleur
              </a>
            </li>
            <li className="rf-menu__item">
              <a className="rf-link" href="/colors#combinaisons" target="_self">
                Combinaisons accessibles
              </a>
            </li>
            <li className="rf-menu__item">
              <a className="rf-link" href="/colors#variables" target="_self">
                Palette de couleur
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li className="rf-nav__item <% if (page === '/ressources') { %> rf-nav__item--active <% } %>">
        <a className="rf-link" href="/ressources" target="_self">
          Ressources
        </a>
      </li>
    </ul>
  </nav>
);

export const HeaderBrand = () => (
  <div className="rf-header__brand">
    <a className="rf-logo" href="/" title="République française">
      <span className="rf-logo__title">
        République
        <br />
        française
      </span>
    </a>
  </div>
);

export const Header = () => (
  <header className="rf-header">
    <div className="rf-container">
      <div className="rf-header__body">
        <HeaderBrand />
        <NavBar />
        <div className="rf-header__tools">
          <div className="rf-search-bar" id="header-search">
            <label className="rf-label" htmlFor="header-search-input">
              Label de la barre de recherche
            </label>
            <input
              className="rf-input"
              placeholder="Rechercher"
              type="search"
              id="header-search-input"
              name="header-search-input"
            />
            <button className="rf-btn" title="Rechercher">
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="rf-container">
      <Nav />
    </div>
  </header>
);

export const FooterBrand = () => (
  <div className="rf-footer__brand">
    <a className="rf-logo" href="/" title="République française">
      <span className="rf-logo__title">
        République
        <br />
        française
      </span>
    </a>
  </div>
);

export const Footer = () => (
  <footer className="rf-footer" id="footer">
    <div className="rf-container">
      <div className="rf-footer__body">
        <FooterBrand />
        <div className="rf-footer__content">
          <p className="rf-footer__content-desc">AppDescription</p>
          <p className="rf-footer__content-desc">
            Le code source est ouvert et les contributions sont bienvenues.
            <a
              title="Voir le code source"
              href="<%= appRepo %>"
              target="_blank"
              rel="noopener"
            >
              Voir le code source
            </a>
          </p>
          <ul className="rf-footer__content-list">
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                title="Contactez-nous"
                href="#"
              >
                Contactez-nous
              </a>
            </li>
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                href="https://www.numerique.gouv.fr/"
              >
                numerique.gouv.fr
              </a>
            </li>
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                href="https://beta.gouv.fr/"
              >
                beta.gouv.fr
              </a>
            </li>
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                href="https://www.gouvernement.fr/"
              >
                gouvernement.fr
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="rf-footer__bottom">
        <ul className="rf-footer__bottom-list">
          <li className="rf-footer__bottom-item">
            <a
              className="rf-footer__bottom-link"
              href="/mentions-legales#accessibilite"
            >
              Accessibilité: non conforme
            </a>
          </li>
          <li className="rf-footer__bottom-item">
            <a className="rf-footer__bottom-link" href="/mentions-legales">
              Mentions légales
            </a>
          </li>
          <li className="rf-footer__bottom-item">
            <a className="rf-footer__bottom-link" href="#">
              Données personnelles
            </a>
          </li>
          <li className="rf-footer__bottom-item">
            <a className="rf-footer__bottom-link" href="#">
              Gestion des cookies
            </a>
          </li>
        </ul>
        <div className="rf-footer__bottom-copy">
          © République Française 2021
        </div>
      </div>
    </div>
  </footer>
);

export const Layout = ({ children }) => (
  <>
    <SkipLinks />
    <Header />
    {children}
    <Footer />
  </>
);
