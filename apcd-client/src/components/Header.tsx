import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUsers, FaBars } from "react-icons/fa";
import Button  from './ui/button';
import { X } from "lucide-react";

import LogoImg from "../assets/logo.png"; // <-- ton logo ici


export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [aboutMegaOpen, setAboutMegaOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const aboutMegaMenuRef = useRef<HTMLDivElement>(null);

  const handleAccountClick = () => {
    if (!user) return navigate("/login");
    if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "user") navigate("/user/dashboard");
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("#")) return location.hash === href;
    return location.pathname === href;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (megaOpen && megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) ||
        (aboutMegaOpen && aboutMegaMenuRef.current && !aboutMegaMenuRef.current.contains(event.target as Node))
      ) {
        setMegaOpen(false);
        setAboutMegaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [megaOpen, aboutMegaOpen]);

  return (
    <header className="relative z-50 bg-white bg-opacity-90 shadow-sm">
      <div className="flex justify-between items-center px-10 md:px-20 ">
        {/* Logo plus grand, mais sans agrandir le header */}
        <img
          src={LogoImg}
          alt="APCD Logo"
          className="h-36 -my-7 -ml-7 w-auto cursor-pointer" // <-- taille augmentée et remontée
          onClick={() => navigate("/")}
        />


        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-800 font-medium relative">
          <Link
            to="/"
            className={`px-3 py-1 rounded-md transition-colors ${
              isActive("/") ? "text-green-700 font-semibold border-b-2 border-green-700" : "hover:text-green-600"
            }`}
          >
            Accueil
          </Link>

          {/* À propos (Desktop Mega) */}
          <div className="relative" ref={aboutMegaMenuRef}>
            <button
              onClick={() => {
                setAboutMegaOpen(!aboutMegaOpen);
                setMegaOpen(false);
              }}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                aboutMegaOpen ? "text-green-700 font-semibold border-b-2 border-green-700" : "hover:text-green-600"
              }`}
            >
              À propos <span className="text-xs">{aboutMegaOpen ? "▴" : "▾"}</span>
            </button>
            {aboutMegaOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white shadow-xl p-6 border border-gray-200 z-50 rounded-xl text-[15px] leading-relaxed">
                <ul className="space-y-2 text-gray-700">
                  <li><Link to="/a-propos" className="hover:text-green-600">Qui sommes-nous ?</Link></li>
                  <li><Link to="/services" className="hover:text-green-600">Nos services</Link></li>
                  <li><Link to="/contact" className="hover:text-green-600">Contact général</Link></li>
                </ul>
              </div>
            )}
          </div>

          <Link
            to="#evenement"
            className={`px-3 py-1 rounded-md transition-colors ${
              isActive("#evenement") ? "text-green-700 font-semibold border-b-2 border-green-700" : "hover:text-green-600"
            }`}
          >
            Événement
          </Link>

          {/* Communauté & Ressources (Desktop Mega) */}
          <div className="relative" ref={megaMenuRef}>
            <button
              onClick={() => {
                setMegaOpen(!megaOpen);
                setAboutMegaOpen(false);
              }}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                megaOpen ? "text-green-700 font-semibold border-b-2 border-green-700" : "hover:text-green-600"
              }`}
            >
              Communauté & Ressources <span className="text-xs">{megaOpen ? "▴" : "▾"}</span>
            </button>
            {megaOpen && (
              <div className="absolute left-0 top-full mt-2 w-[40rem] max-w-[80vw] bg-white shadow-xl p-8 border border-gray-200 z-50 rounded-xl text-[15px] leading-relaxed flex flex-col gap-3">
                {/* Nos communautés */}
                <ul className="mb-4 space-y-2 text-gray-700">
                  <li><Link to="/communautes" className="hover:text-green-600 font-semibold text-lg">🌍 Nos communautés</Link></li>
                </ul>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
                  <div>
                    <h4 className="font-bold text-green-700 mb-3">📸 Galerie & Médias</h4>
                    <ul className="space-y-1">
                      <li><Link to="/galerie/photos" className="hover:text-green-600">Photos</Link></li>
                      <li><Link to="/galerie/videos" className="hover:text-green-600">Vidéos</Link></li>
                      <li><Link to="/galerie/telechargements" className="hover:text-green-600">Téléchargements</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-700 mb-3">📂 Ressources</h4>
                    <ul className="space-y-1">
                      <li><Link to="/ressources/documents" className="hover:text-green-600">Documents</Link></li>
                      <li><Link to="/ressources/rapports" className="hover:text-green-600">Rapports</Link></li>
                      <li><Link to="/ressources/communiques" className="hover:text-green-600">Communiqués</Link></li>
                      <li><Link to="/ressources/formulaires" className="hover:text-green-600">Formulaires</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-700 mb-3">🏢 Secrétariat</h4>
                    <ul className="space-y-1">
                      <li><Link to="/secretariat/annuaire" className="hover:text-green-600">Annuaire</Link></li>
                      <li><Link to="/secretariat/reglement" className="hover:text-green-600">Règlement</Link></li>
                      <li><Link to="/secretariat/finances" className="hover:text-green-600">Finances</Link></li>
                      <li><Link to="/secretariat/pv" className="hover:text-green-600">PV réunions</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-green-700 mb-3">🌐 Liens utiles</h4>
                  <ul className="grid grid-cols-2 gap-2 text-gray-700">
                    <li><Link to="/liens/visa" className="hover:text-green-600">Visa</Link></li>
                    <li><Link to="/liens/emplois" className="hover:text-green-600">Emploi</Link></li>
                    <li><Link to="/liens/formations" className="hover:text-green-600">Formations</Link></li>
                    <li><Link to="/liens/vie-pratique" className="hover:text-green-600">Vie pratique</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {!user ? (
            <Button onClick={() => navigate("/login")} className="bg-green-600 text-white text-sm flex items-center">
              <FaUsers className="mr-2" /> Se connecter
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (user.role === "admin") navigate("/admin/dashboard");
                else navigate("/user/dashboard");
              }}
              className="border border-green-600 text-green-600 text-sm flex items-center gap-1 cursor-pointer"
            >
              <FaUsers /> Mon compte
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-green-700 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6">
          <nav className="flex flex-col gap-4 text-gray-800 font-medium">
            <Link to="/" className={`hover:text-green-600 ${isActive("/") ? "text-green-700 font-semibold border-b-2 border-green-700" : ""}`} onClick={() => setMenuOpen(false)}>Accueil</Link>

            {/* Mobile À propos */}
            <div>
              <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)} className={`w-full text-left flex justify-between items-center ${mobileAboutOpen ? "text-green-700 font-semibold border-b-2 border-green-700" : "hover:text-green-600"}`}>
                À propos <span className="text-sm">{mobileAboutOpen ? "▴" : "▾"}</span>
              </button>
              {mobileAboutOpen && (
                <ul className="pl-4 mt-2 flex flex-col gap-2 text-gray-700 text-[15px]">
                  <li><Link to="/a-propos" onClick={() => setMenuOpen(false)}>Qui sommes-nous ?</Link></li>
                  <li><Link to="/services" onClick={() => setMenuOpen(false)}>Nos services</Link></li>
                  <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
                </ul>
              )}
            </div>

            <a href="#evenement" className={`hover:text-green-600 ${isActive("#evenement") ? "text-green-700 font-semibold border-b-2 border-green-700" : ""}`} onClick={() => setMenuOpen(false)}>Événement</a>

            {/* Mobile Mega */}
            <button onClick={() => setMobileMegaOpen(!mobileMegaOpen)} className="text-left">
              Communauté & Ressources {mobileMegaOpen ? "▴" : "▾"}
            </button>
            {mobileMegaOpen && (
              <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 mt-2">
                <div>
                  <Link to="/communautes" className="hover:text-green-600 font-bold text-sm">🌍 Nos communautés</Link>
                  <p className="font-bold mb-2 mt-2">📸 Galerie & Médias</p>
                  <ul className="space-y-1">
                    <li><Link to="/galerie/photos" onClick={() => setMenuOpen(false)}>Photos</Link></li>
                    <li><Link to="/galerie/videos" onClick={() => setMenuOpen(false)}>Vidéos</Link></li>
                    <li><Link to="/galerie/telechargements" onClick={() => setMenuOpen(false)}>Téléchargements</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">📂 Ressources</p>
                  <ul className="space-y-1">
                    <li><Link to="/ressources/documents" onClick={() => setMenuOpen(false)}>Documents</Link></li>
                    <li><Link to="/ressources/rapports" onClick={() => setMenuOpen(false)}>Rapports</Link></li>
                    <li><Link to="/ressources/communiques" onClick={() => setMenuOpen(false)}>Communiqués</Link></li>
                    <li><Link to="/ressources/formulaires" onClick={() => setMenuOpen(false)}>Formulaires</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">🏢 Secrétariat</p>
                  <ul className="space-y-1">
                    <li><Link to="/secretariat/annuaire" onClick={() => setMenuOpen(false)}>Annuaire</Link></li>
                    <li><Link to="/secretariat/reglement" onClick={() => setMenuOpen(false)}>Règlement</Link></li>
                    <li><Link to="/secretariat/finances" onClick={() => setMenuOpen(false)}>Finances</Link></li>
                    <li><Link to="/secretariat/pv" onClick={() => setMenuOpen(false)}>PV réunions</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">🌐 Liens utiles</p>
                  <ul className="space-y-1">
                    <li><Link to="/liens/visa" onClick={() => setMenuOpen(false)}>Visa</Link></li>
                    <li><Link to="/liens/emplois" onClick={() => setMenuOpen(false)}>Emploi</Link></li>
                    <li><Link to="/liens/formations" onClick={() => setMenuOpen(false)}>Formations</Link></li>
                    <li><Link to="/liens/vie-pratique" onClick={() => setMenuOpen(false)}>Vie pratique</Link></li>
                  </ul>
                </div>
              </div>
            )}

            {/* User Buttons Mobile */}
            <div className="mt-4 flex flex-col gap-2">
              {!user ? (
                <Button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="bg-green-600 text-white flex items-center justify-center">
                  <FaUsers className="mr-2" /> Se connecter
                </Button>
              ) : (
                  <Button onClick={() => { handleAccountClick(); setMenuOpen(false); }} className=" border border-green-600 text-green-600 text-sm flex items-center justify-center gap-1 cursor-pointer "><FaUsers /> Mon compte</Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
