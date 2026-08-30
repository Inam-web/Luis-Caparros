import { HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { LanguageProvider } from "./i18n";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Biography from "./pages/Biography";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Store from "./pages/Store";
import Series from "./pages/Series";
import OilPage from "./pages/OilPage";
import { Checkout, Confirmacion } from "./pages/Checkout";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";

/** Keeps old Spanish URLs (from previous builds / shared links) working by
    redirecting them to the current English routes, preserving the slug. */
function LegacyBookRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/books/${slug}`} replace />;
}

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/biography" element={<Biography />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:slug" element={<BookDetail />} />
              <Route path="/store" element={<Store />} />
              <Route path="/lagrimas-saladas-trilogy" element={<Series />} />
              {/* Standalone oil page — intentionally NOT linked from author pages */}
              <Route path="/olive-oil" element={<OilPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmed" element={<Confirmacion />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/accessibility" element={<Legal />} />
              <Route path="/legal-notice" element={<Legal />} />
              <Route path="/cookie-policy" element={<Legal />} />
              <Route path="/privacy-policy" element={<Legal />} />

              {/* ---- legacy redirects (old Spanish URLs keep working) ---- */}
              <Route path="/libros" element={<Navigate to="/books" replace />} />
              <Route path="/libros/:slug" element={<LegacyBookRedirect />} />
              <Route path="/tienda" element={<Navigate to="/store" replace />} />
              <Route path="/tienda/aove-cosecha-propia" element={<Navigate to="/olive-oil" replace />} />
              <Route path="/tienda/evo-own-harvest" element={<Navigate to="/olive-oil" replace />} />
              <Route path="/biografia" element={<Navigate to="/biography" replace />} />
              <Route path="/contacto" element={<Navigate to="/contact" replace />} />
              <Route path="/finalizar-compra" element={<Navigate to="/checkout" replace />} />
              <Route path="/pedido-confirmado" element={<Navigate to="/order-confirmed" replace />} />
              <Route path="/accesibilidad" element={<Navigate to="/accessibility" replace />} />
              <Route path="/aviso-legal" element={<Navigate to="/legal-notice" replace />} />
              <Route path="/politica-de-cookies" element={<Navigate to="/cookie-policy" replace />} />
              <Route path="/politica-de-privacidad" element={<Navigate to="/privacy-policy" replace />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </StoreProvider>
    </LanguageProvider>
  );
}