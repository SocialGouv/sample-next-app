import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* see polyfill.io */}
          <script src="//polyfill.incubateur.social.gouv.fr/v3/polyfill.min.js"></script>
          <link
            rel="stylesheet"
            href="//socialgouv.github.io/bootstrap/master/@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"
            integrity="grB93+Lj8+H7BK2kCBM0dGAJD+8tE7pYqy6qkcykr8DfCJt7PhJOF998Bwj7BAWc"
          />
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
