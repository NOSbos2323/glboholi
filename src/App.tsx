import React from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { createLazyComponent } from "./utils/performance";

// Import tempo routes conditionally
let routes: any = null;
if (import.meta.env.VITE_TEMPO) {
  try {
    routes = await import("tempo-routes")
      .then((m) => m.default)
      .catch(() => null);
  } catch {
    routes = null;
  }
}

// Lazy load components for better performance
const Home = createLazyComponent(() => import("./components/home"));
const LoginPage = createLazyComponent(
  () => import("./components/auth/LoginPage"),
);
const PaymentsPage = createLazyComponent(
  () => import("./components/payments/PaymentsPage"),
);

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-500 animate-pulse" />
      <p className="text-white text-sm">جاري التحميل...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<PageLoader />}>
        {/* Tempo routes - only in development */}
        {import.meta.env.VITE_TEMPO && routes && useRoutes(routes)}

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/payments" element={<PaymentsPage />} />

          {/* Allow tempo routes to work */}
          {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

          {/* Redirect root to login */}
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
