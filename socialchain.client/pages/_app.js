import { AuthProvider } from "@/context/AuthProvider";
import "@/styles/globals.css";
import Head from "next/head";
export default function App({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;
  return (
    <AuthProvider>
      <Head>
        <title>Social chain</title>
        <meta name="description" content="Social chain" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/blockchain.ico" />
      </Head>
      <div className="bg-darkBlack backdrop-blur-sm lg">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </AuthProvider>
  );
}

const DefaultLayout = ({ children }) => <>{children}</>;
