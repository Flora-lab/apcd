import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonials from "../components/Accueil/Testimonials";
import CommunitySection from "../components/Accueil/CommunitySection";
import AboutSection from "../components/Accueil/about";
import FeaturesCardsSection from "../components/Accueil/FeaturesCardsSection";
import HeroSection from "../components/Accueil/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <HeroSection/>
        <FeaturesCardsSection />
        <AboutSection />
        <CommunitySection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
