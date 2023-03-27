import { AuthProvider } from "@/context/AuthProvider";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout;
  return (
    <AuthProvider>
      <div className="bg-darkBlack backdrop-blur-sm lg">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </AuthProvider>
  );
}

const DefaultLayout = ({ children }) => <>{children}</>;
