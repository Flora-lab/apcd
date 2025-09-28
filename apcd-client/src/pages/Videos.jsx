import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Videos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">Vidéos</h1>
          <p className="text-lg text-gray-600">Aucune vidéo disponible pour le moment.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
