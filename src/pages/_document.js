import React from "react";
import crypto from "crypto";
import Document, { Html, Head, Main, NextScript } from "next/document";

const cspHashOf = (text) => {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return `'sha256-${hash.digest("base64")}'`;
};

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const scriptSrc = [
      "'self'",
      cspHashOf(NextScript.getInlineScriptSource(this.props)),
    ];
    if (process.env.NODE_ENV !== "production") {
      // for next.js dev server
      scriptSrc.push("'unsafe-eval'");
      scriptSrc.push("'unsafe-inline'");
    }
    const csp = `default-src 'self'; script-src ${scriptSrc.join(
      " "
    )}; style-src 'unsafe-inline'`;

    return (
      <Html lang="fr">
        <Head>
          <meta httpEquiv="Content-Security-Policy" content={csp} />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
