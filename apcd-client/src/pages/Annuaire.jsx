import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Annuaire() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-3xl font-bold text-green-700 mb-4">Annuaire</h1>
          <p className="text-gray-600 text-lg">Aucun contact disponible dans l’annuaire pour le moment.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
