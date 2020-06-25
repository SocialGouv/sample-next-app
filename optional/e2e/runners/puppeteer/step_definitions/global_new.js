const { Soit, Quand, Alors } = require("./_fr");

const { I } = inject();

Soit("un navigateur web sur le site", () => {
  I.amOnPage("/");
});

Quand("j'attends {int} secondes", (num) => {
  I.wait(num);
});

Quand("je clique sur {string}", (text) => {
  I.click(text);
});

Alors("je vois {string}", (text) => {
  I.see(text, "#__next");
});

Alors("je suis redirigé vers la page: {string}", (url) => {
  I.waitInUrl(url, 10);
});
