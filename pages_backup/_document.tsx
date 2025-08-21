import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div id="test-marker" style={{position: 'fixed', top: 0, left: 0, background: 'yellow', zIndex: 9999}}>
          _document.tsx is loaded
        </div>
        {/*
          IMPORTANT: This script will run in the global scope
          after your Next.js app's main scripts have loaded.
          Place it here at the end of the body for best results.
        */}
        <script src="/console-tests.js"></script>
      </body>
    </Html>
  );
}
