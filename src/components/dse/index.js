import clsx from "clsx";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

// prevent issue with Link and Func components https://github.com/vercel/next.js/issues/7915
function LinkWrap({ children, refAs, ...props }, ref) {
  if (refAs) {
    props[refAs] = ref;
  }
  return React.isValidElement(children)
    ? React.cloneElement(children, props)
    : null;
}

const LinkWrapper = React.forwardRef(LinkWrap);

export const Link = ({ refAs, children, ...props }) => (
  <NextLink {...props} passHref>
    <LinkWrapper refAs={refAs}>{children}</LinkWrapper>
  </NextLink>
);

export const SkipLinks = () => (
  <div className="rf-skiplinks">
    <div className="rf-container">
      <ul className="rf-skiplinks__list">
        <li>
          <Link href="#contenu">
            <a className="rf-link">Accéder au contenu</a>
          </Link>
        </li>
        <li>
          <Link href="#header-navigation">
            <a className="rf-link">Accéder au menu</a>
          </Link>
        </li>
        <li>
          <Link href="#header-search">
            <a className="rf-link">Accéder à la recherche</a>
          </Link>
        </li>
        <li>
          <Link href="#footer">
            <a className="rf-link">Accéder au footer</a>
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export const NavBar = () => (
  <div className="rf-header__navbar">
    <div className="rf-service">
      <Link href="/">
        <a className="rf-service__title" title="AppName">
          AppName
        </a>
      </Link>
      <p className="rf-service__tagline">AppDescription</p>
    </div>
  </div>
);

export const Nav = () => {
  const router = useRouter();
  return (
    <nav
      className="rf-nav"
      role="navigation"
      aria-label="Menu principal"
      id="header-navigation"
    >
      <ul className="rf-nav__list">
        <li
          className={clsx({
            "rf-nav__item": true,
            "rf-nav__item--active": router.pathname === "/",
          })}
        >
          <Link href="/">
            <a className="rf-link" title="Accueil">
              Accueil
            </a>
          </Link>
        </li>
        <li
          className={clsx({
            "rf-nav__item": true,
            "rf-nav__item--active": router.pathname === "/design-system",
          })}
        >
          <Link href="/design-system">
            <a className="rf-link">Design system</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

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
          <div style={{ display: "flex" }}>
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
            <Link href="/login">
              <Button
                style={{ marginLeft: 20 }}
                icon="account-line"
                iconPosition="left"
              >
                login
              </Button>
            </Link>
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

//https://gouvfr.atlassian.net/wiki/spaces/DB/pages/222331372/Grille+et+points+de+rupture+-+Grid+and+breakpoints
export const Container = (props) => (
  <div {...props} className={clsx("rf-container", props.className)} />
);

export const Grid = (props) => {
  return (
    <div
      className={clsx("rf-grid-row", props.gutters && "rf-grid-row--gutters")}
      {...props}
    />
  );
};

export const Tag = (props) => <p className="rf-tag" {...props} />;

const breakpoints = ["xs", "sm", "md", "lg", "xl"];

export const Col = (props) => {
  const xs = props.xs || 12;
  const colClasses = [
    `rf-col-${xs}`,
    ...breakpoints
      .slice(1)
      .map((point) => props[point] && `rf-col-${point}-${props[point]}`)
      .filter(Boolean),
  ];
  return <div className={clsx(colClasses)} {...props} />;
};

export const Footer = () => (
  <footer className="rf-footer" id="footer">
    <Container>
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
    </Container>
  </footer>
);

export const Card = ({ title, children }) => (
  <div className="rf-card">
    <div className="rf-card__body">
      <h2 className="rf-card__title">{title}</h2>
      <p className="rf-card__desc">{children}</p>
    </div>
  </div>
);

export const Callout = ({ children }) => (
  <div className="rf-callout rf-fi-information-line rf-callout--scheme-soft-blue-soft rf-mb-3w">
    <p className="rf-callout__text">{children}</p>
  </div>
);

export const HighLight = ({ children }) => (
  <div className="rf-highlight">{children}</div>
);

export const icons = [
  "account-fill",
  "account-line",
  "alert-fill",
  "alert-line",
  "arrow-down-line",
  "arrow-down-s-line",
  "arrow-left-line",
  "arrow-left-s-line",
  "arrow-right-line",
  "arrow-right-s-line",
  "arrow-up-line",
  "arrow-up-s-line",
  "calendar-fill",
  "calendar-line",
  "check-line",
  "checkbox-line",
  "close-circle-line",
  "close-line",
  "delete-fill",
  "delete-line",
  "download-line",
  "edit-fill",
  "edit-line",
  "external-link-line",
  "eye-line",
  "eye-off-line",
  "file-download-fill",
  "file-download-line",
  "file-fill",
  "file-line",
  "file-pdf-fill",
  "file-pdf-line",
  "information-fill",
  "information-line",
  "lock-fill",
  "lock-line",
  "mail-fill",
  "mail-line",
  "menu-2-fill",
  "menu-fill",
  "pause-circle-fill",
  "pause-circle-line",
  "play-fill",
  "play-line",
  "printer-fill",
  "printer-line",
  "question-fill",
  "question-line",
  "save-fill",
  "save-line",
  "search-fill",
  "search-line",
  "user-fill",
  "user-line",
  "volume-down-fill",
  "volume-down-line",
  "volume-mute-fill",
  "volume-mute-line",
  "volume-up-fill",
  "volume-up-line",
];

export const Icon = (props) => {
  return (
    <span
      className={clsx(
        props.icon && `rf-fi-${props.icon}`,
        props.size && `rf-fi--${props.size}`
      )}
    />
  );
};
/*
variant: "secondary"
size: sm,md,lg
icon: https://gouvfr.atlassian.net/wiki/spaces/DB/pages/222331396/Ic+nes+-+Icons
iconSize: lg,xl
iconPosition: left,right
*/
export const Button = (props) => {
  return (
    <button
      className={clsx(
        "rf-btn",
        props.variant && `rf-btn--${props.variant}`,
        props.size && `rf-btn--${props.size}`,
        props.icon && `rf-fi-${props.icon}`,
        props.iconPosition && `rf-btn--icon-${props.iconPosition}`,
        props.iconSize && `rf-fi--${props.iconSize}`
      )}
      {...props}
    />
  );
};

export const Layout = ({ children }) => (
  <>
    <SkipLinks />
    <Header />
    <Container className="rf-py-6w rf-pt-2w">{children}</Container>
    <Footer />
  </>
);
