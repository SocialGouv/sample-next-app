import { ok } from "assert";
import { create } from "@socialgouv/kosko-charts/components/app";
import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("app");
const { deployment, ingress, service } = create(params);

//
ok(process.env.CI_ENVIRONMENT_NAME);
if (
  process.env.CI_ENVIRONMENT_NAME.endsWith("-dev") ||
  process.env.CI_ENVIRONMENT_NAME.endsWith("prod")
) {
  // HACK(douglasduteil): our cluster v1 is not supporting the `startupProbe`
  // Our cluster v1 is stuck in k8s v1.14 :(
  delete deployment.spec!.template.spec!.containers[0].startupProbe;
}

//

const envConfigMap = new ConfigMap({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env`,
  },
  data: {
    NODE_ENV: process.env.NODE_ENV || "production",
    FRONTEND_HOST: "${HOST}", // todo: for emails ?
    GRAPHQL_ENDPOINT: "http://hasura/v1/graphql",
    ACCOUNT_MAIL_SENDER: "contact@fabrique.social.gouv.fr",
    FRONTEND_PORT: "${PORT}",
    PRODUCTION: "false", // todo: override in prod
  },
});

const secret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    name: `${params.name}-env`,
  },
  spec: {
    encryptedData: {
      ACCOUNT_EMAIL_SECRET:
        "AgAaWpK74anskV8ARepzngTnmUSXTDS6U0FPlZR6fFr+i0OIu8WMry/JRCLyewOYHAS5GySqQUhcZQc0gfdfCp8Cbvj99r+hfAxdYnho7p68aLx5g9lf6PsJ/NcKb7C84PuNzk1DQETpes8H04maHIErIeRKYzzYGWoMJ7wpn/mrUnmH2c0HEoqiz75V1S+Phus4cbqrWtoWQt57dIZY4rCDSfA+1qOosbYqcCixK2EARMHcXEwOi0bJOP5HY7VIuxG89MizQmTBGnaS7cawlQI7v63NmTUVQ3tHpzGwGtZe45fOAJv9pCHfSsieP1RixX2H/kwUo68nI/l96PkLHcZG8P9eG/MLNBe0tVCSPYhrUJLFFQ9OAzhwr3TjSy6au5vKhu4jqNOfG1WT6zAHK3m2NsW5RHTxJdcmz24BP8YTzf67lcJyjGD06UwtmnJP/VkuKmQIjQZtrHQlqkumYVrJ0T2EPlh6P2/YoaM+kCqxstddiJ4uDxZPTPBA/UJxwAwY6StjZPK/ELcJIpn4yqoQ9+9Wz/atAOaFtjp2qIvjIKBPsNRfrl0sOGqV5+T83vMXECcaFXuuTasnnJQNuQ1r4902Qv47NCIp00MI/ALYDJ0L3adVEgqAZGf70wKScOBtHkNjhTaofSj8yxm7Pvy1D/RU+Ak5l813Bi1G0exkFbSzuDULBk59AjIVUlncF9vHcJJ7milYMSSF1Zx2ic4=",
      HASURA_GRAPHQL_ADMIN_SECRET:
        "AgA1HEYbYg0v23HMMeXouEBqWe9Xx1Q81zebB/hBtE/7W1oiLl+ZFPByDNax47DTDKs3ep406+rpc0GMqVuUygZO45VsMKkap9X2wdBL/LVlMl871FsP0z+KL0mKcitg/8cymh2irrqMbycTUDJKL9h42xhI7c0f0GUFIgcozgLRhQJZ7QeXXFf7ydwZaEKn33ZdYSil5vcly1PwpycBAoDTPbTG1egMbXBBXXJZVIGIYqddytlVsQ9VyyNj0NbHj6v1amYLHlmdjBnqFJn5B5QX549bCbQahETauB5zZI9gXu7Qm+GAFaDk79eTiIMA9lmDIaMd1maIi0dEw4NKvLFpsRhdxlNgo1O6dOcmznn8j2jQExZ85cZ6fwxQtW/kPHTueFY8X3jGvjceokAWJ/yLSRYscbl1gIiolJ9mpLkWvrjLpEugYJWa/KI+wocXaXFx/2abrDn+u7JL9frF2XvjesxMmvVLdVis2imDvTVv4Y8qTqzUg2tGoM7VX4Pul3CGr62D9BDxN+3nviiC3NR2+JfEnx4wsUWhqLnTl5cAoPQXSa3peIulORaKA3EbdrlSN6QsF9TTGt+qlPxw6G07bSLF9zeTpFyDMKWUdGAqzWJL6wh/dhcO4Sj+mwIK+chzoXJ022+AHrdX2BeV0Ss8qAqDzSf+KUQ4N5BHehrzXZAtWEayeN5yqx8EJH6bkcLJnAchar8eboZlFHQ1LBQ1fpf8JhY=",
      HASURA_GRAPHQL_JWT_SECRET:
        "AgBka5mbVGPS+4nyeHJUc9dcGZ1tRGRk1toQkOSDdp0WPF5Tz3yOZwlDL9evQ+OSuKX62kpLfnvX8Oh/Z17y+BiuTBt09mu1kwOFSuT/RJTbfeaZz0RVahKRYI56V9NsPpLk3FjHP/xLhYyY3m2Q1rC78xPxt3DbAlq/bVFYuF8ZDWXVBQodlbShN0UeL+VyqJVItrYPpF2cWAcYmR941Swu1B7TJF8xVUB1PWqSx6h5Q0Z3y/i8gxj0GSM3yawRa+XkFGb0bAe59g3ZxVKj0zhL1hZtFik/QQiRDs/w/eoZhpglopfnDZ8ngY9IVmM+o2NrQyu2C/ICiy0zxP9nT4EVmNZ9Hkhz+gkvJ4377OF3zdwRfjZ0Y/JUwFyXqYJWkXDpET5n2AxoUSpnM3IZRQb8KmPNYBfWUMfMcVz8aCkhPaFPfYvIllpm2KaCGTDcoT2RBP6qRpivDuPXfD49P0StUKqUXfSefR055xQ88oTapmJUJ/14vl9N5mx+nv0RANgalRLtJZXVMEuHFKu8f1WPkeyZSVU+dznh5a4CoXLm7vQc/HvduAYqE9VSpUyyKnUB+MMBr2V/LViZzqc77Yo5FA+gkwepdj7gPG85gEBzyMc2cn7OJFOEssFDrbmiNc3VsrPqmCNu2s25uXG1Ts+nDcCmS661Ahkqh83MTrz8h9LMKyiFPSDPfFHQF9KHA8NfWLnCw9tP73LrnsX8wKygsyBaF9WE3dhR1n86kRFkfnfzE+fMg1Eq2fPdILQ3gO+512Z9oBw1r/fcraRip29SCbAcRnE7bbANYTbvZUSLtmriPSoRkA1/fFgF5l6upiSyXTPh2njPb9A2R9labb2GpYDl2KI6Krn2Za0jbQ/17qV2Cw9WYN8s3wul7x4V7ZpEsF1YqktEFye8wL91kZC/NPq1b9cU5Nu1cxzuTzV/xO40AnyflXE4wLVpa06tnbOxuUJsKPpp6n8E6kEAjnX2NEgICMYZZxM08+WveBSS+E5wF2SLJyrVvlikXD0yGMUptyT49eCIEAw/1xMm6IFgn9FrT2ZFFDJYonqhzPqn+IUZKUJ6AdbQc1xCI8+oIzFqmpQxGrY9YnoRkwhhrbxHmVsPCNbw6i8QwIZvcyTqUEGmhD1d5aBG6Sn0jSEk7/wTcQGO9Oto0zoMlkcAvMIA/KWRPYMajjTgdQRWGwhy++/0Fr1oEDfVAqbP83CLToMKIHJVOJd6RvMLt5744HpTSMKdtrantU6GJSpADoHSLoskIKdsieKE/zdL1INjEhIjbhXNQni3gVWM/hp0j0wn9nSO3o9xp5M+CccyZ7aymKsPlJsxQhqcMBLk8Gjc3JY0yAhQf10TSJE5jKaO+2LAa64HolZVx8EhtustcMOlY0AxGUCDxkOU3WFmUlUDe24uRO9Lpn+Ls93xKZW2vk5xHWrrK4dC0mjS/9sxBfk7aUaZ5v0r2cQ8clDhujeCXYGo+TiC9LEFRbqRuXeuObRawUhlLK3lQVyE7LcreczApIRRuIRcYhXSjEJfmlnHn8vabZM0x/6SjfItKOLqOpXOHQCkbw2U6ULJcAHn+uE/U5j28qfZE6YLgPgwb0rZV9ivygpae+hb4op66u4ys8zAN2bMbblgRVHYaQg061oX3wr2ydQRVOTsUi2ui1O/2QX4A2E6ZITyuzeYF/609TXAFGYnsHmSqyBHg089Ry7QD+k5uXqTK6WkMatkN3es/+eSGFChqV7fxwAezpQ9wyHsv1DBOsWfAaLHxZ1MPDwDnkerQUZSp8uvIY/kmi+OumiT47DjvU3BWSWGX0kKxmgPdYmULj0=",
      SMTP_EMAIL_PASSWORD:
        "AgDNfvjjOEcOx91VSaaAMwMedyjNyGEGAEs+4ZhL2LvEC2WT15ChSEOX1YadgVLwZQ3UdoH7CXPjmsuBEg32pA9d6fPPZjGD7Su/2tf5mprTT+OC+4WDeUHGXiPfIZhpkPf+15KOGyxP8u4GdRDeBe1dMwfL+zd2/e/D9Ks+n+XO9QhefekJ/4ex8P776r0en1fo6dQ/6YVbyHm4ejokbXkkyNQxygWzgSeHCyYfBvCbzq8URV3OKiVzLQ5UGEIWkI+nAOmkXZRAv1vmGb82rAUGo9c/yyiQ17qcItUj9zUo3zoc8Be8FBlw+SHu/7x6kTkGPKLkRsmvwX4ZKH+Qv5yli4cnaFiuE6VnRJSSkmbGg+lXimHw8Mh20S7eXr9iXIQ33WUNb/9cY4+wHSC/RErL+QxOm8nztRDqawfnnLeCE9ACXl44wQCVW7/8iwRaLOUmiv10bmf9PTaXp/8aS01JZlr9ZVNQGuM0lyfFLIxun0o5pGtLwQXpAFE1eV1W9hWR7yeE8BB8UNgOBsBqDGWwMtQ0F+KtkJTSlS48u5nlIoFZ6C/vPPIC9CCB2WI4UeCLvGcROr2mLUUWEm33i5h8A4FEP4F49JlhUT8C/18S0BdBrQGMC5gZ0dQ8zhaU0PIbValko2F7/qKsZ4qkcS5zcOOhbKUM9rQmOVj8/NsmwAAviZX81iIOlyMflLSdaasOz+cURRX7HNKxixff",
      SMTP_EMAIL_USER:
        "AgBkYpM2dFqHtzeRtg4NVTiv3CEKvLKFHtNVR57AEiBt6wZRmHgRmAz32qxT72R7xOjHmnT90H0WZcawfLDzkZwPTgsUROeIYS40nTwIG1PNy8B/Nm7l53MuURxF0krY9o0NEWK0zsQHsjCmremPQiGpqWXehGoC6UlxEQF+efa0U/+DK/nnyqE9RSYj2pAsVwj9MgIMZUS04Uxlh3J7+fCPOtr5GxcIiGhWMH5krikop2YYn4YTLtQRzaHJVlM26glDS3RDNMVYvM9qlwJCByXhb1JoKQDKqIiCdZD7XKIdwF4inOrSF03Ph757n7CyoHf5z3unjrUEEcQTMr3mZT7bKZp1zlWX5K95sKjXzxoTnJzjKgMfij93KC2aVCKCBtAGDlFO4Ms0evD5WnL0CBLB+9ti8h394CArAUNzNaFtkdVVJAjdEZqjMSmMrAqGfrkBCoS3covTAoz1bLmrpqtppm83tsPCwwiRzLkZTq9LsQyrzmDlA0Nv5t05xwErsYVvE8K69dAlNb9eTB9ca3xITPMeZLwSPWILdOMP81reJp/i/CbWGrQaMIS2H8k3RgHG6HqY8bSS7TP2Mhl8RJsz/deEpluy+boQcerQ6SNt9f6FeMdwg9lkXzV4beE4/dQ0VXm4OgICe8GcIPsIsh0bxCBWagCei6dXC1jt4AHGsAFdJImjhorz4eP2cRiPDXp5Z0dzRWRcOH8=",
      SMTP_URL:
        "AgAoYV9e4gVnSI6xbrOQFv/rKH03HdPHZO09x2qwpu3HAIgkXiz7b50psntD386QxVuIWLVAubUX8gbxYUj1/xaUf2weEDXV1NIRaHlelTyx+DFnzL9UwR6cKeeCCEk+HaMnU1LPfnst8lv0sVnpXBENIX475k1UOLy23iP3D/TJOQ3jmvkD02c8xhDW/jH6N/JvSYLIDz3foo2I1Yb7ikmuh1eUjtYNq2z/C4BDTopSEa4GR2lxqJgENLgjZ4Jp9mDbLJwEcQ8jT+hWWkR2NmC3G9IPwXONQ+PBehZlvstj/Xtz/6QB2NTPHdch93lEbsyWRoMAzFGjEsfKLVN9DhcDnVLmy0PDO/BQtDrXrCp0afF3PXZQ6zSqtW7P4/PvwOvZfqMNyP0V/YhPVKOKvgHGnPOIF4Yk7VsOajE+x5dCgSDJjdcYSURJazFYmsd4uZ0qELX68RDUGZpEwzISdcU5Pzr5/y2cg2qmACSWuct7ySfYwtHhaifp2fiHmj9gmeFtNb0RHLfMatYjGs8+N/A56FpvUdRkVM9VnhZjgBTERKAujbSrZF0z3IcB8IqODRHMtDZ/jgTLluNb3un7thI2zm5dmO4Sv4rOiOv0RYoFxKMK8767XSmZgZjuQVt/RrosdAOJu9RMz5dxpKaeMb/MtIBkW97vatyBNB0O8iRJCGKimuI0gDW+8jBGhYjOtFLoZH0ZGh96+d09NGoiMbWN",
    },
    template: {
      type: "Opaque",
      metadata: {
        annotations: {
          "sealedsecrets.bitnami.com/cluster-wide": "true",
        },
        ...metadataFromParams(params),
        name: `${params.name}-env`,
      },
    },
  },
});

deployment.spec!.template.spec!.containers[0].envFrom = [
  {
    configMapRef: { name: `${params.name}-env` },
  },
  {
    secretRef: { name: `${params.name}-env` },
  },
];

//

export default [secret, deployment, ingress, service, envConfigMap];
