import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import ProductForm from "./pages/ProductForm.jsx";
import ImpactForm from "./pages/ImpactForm.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("product");

  // Initialize dark mode (safe for SSR)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme) {
        return savedTheme === "dark";
      }

      if (window.matchMedia) {
        return window
          .matchMedia("(prefers-color-scheme: dark)")
          .matches;
      }
    }

    return false;
  });

  // Apply/remove dark class on <html>
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Listen for system theme changes (if user hasn't manually set one)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = (e) => {
      // Only auto-update if user hasn't selected a theme
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
      }
    };

    // Safari compatibility
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100 transition-colors duration-500">
      <div className="bg-mesh" />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl relative z-10">
        {activeTab === "product" ? (
          <ProductForm />
        ) : (
          <ImpactForm />
        )}
      </main>

      <footer className="py-8 mt-auto text-center text-slate-500 dark:text-slate-400 text-sm font-medium border-t border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm transition-colors duration-500">
        <p>
          © {new Date().getFullYear()} Rayeva AI. Powered by Gemini.
        </p>
      </footer>
    </div>
  );
}