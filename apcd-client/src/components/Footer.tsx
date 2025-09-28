import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-16 pb-8 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        {/* APCD / mission */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">APCD</h3>
          <p className="text-sm text-gray-400">
            L’Association des Professionnels Camerounais de la Diaspora (APCD) œuvre pour l’unité, l’autonomisation et la réussite des membres à travers le monde.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-white">Accueil</a></li>
            <li><a href="/a-propos" className="hover:text-white">À propos</a></li>
            <li><a href="/activites" className="hover:text-white">Activités</a></li>
            <li><a href="/temoignages" className="hover:text-white">Témoignages</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1" />
              <span>Paris, France & Yaoundé, Cameroun</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt />
              <a href="tel:+33712345678" className="hover:text-white">+33 7 12 34 56 78</a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope />
              <a href="mailto:contact@apcd.org" className="hover:text-white">contact@apcd.org</a>
            </li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Réseaux sociaux</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition"><FaFacebookF /></a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-400 transition"><FaTwitter /></a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-pink-500 transition"><FaInstagram /></a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-700 transition"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 pt-6 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} APCD. Tous droits réservés. | Conçu avec ❤️ pour la diaspora.
      </div>
    </footer>
  );
};

export default Footer;
