import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Telechargements() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">Téléchargements</h1>
          <p className="text-lg text-gray-600">Aucun fichier disponible au téléchargement.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
