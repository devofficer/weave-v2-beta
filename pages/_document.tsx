import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Blinker:wght@100;200;300;400;600;700;800&display=swap" rel="stylesheet" />
          <meta name="description" content="Weave Financial Dapp V2 content" key="desc" />
          <meta property="og:title" content="Weave Financial Dapp V2 " />
          <meta
            property="og:description"
            content="And a social description for our cool page"
          />
          <meta
            property="og:image"
            content="https://example.com/images/cool-page.jpg"
          />
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
