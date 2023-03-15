import { AuthProvider } from "@/context/AuthProvider";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="bg-darkBlack">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
