import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Finances() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">Rapports financiers</h1>
          <p className="text-lg text-gray-600">Aucun rapport financier disponible.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
