import React, { useState } from "react";
import Select from "react-select";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { api } from "../api/axios"; // <-- ton axios configuré

const countries = [
  { name: 'Afghanistan', code: '+93' },
  { name: 'Afrique du Sud', code: '+27' },
  { name: 'Albanie', code: '+355' },
  { name: 'Algérie', code: '+213' },
  { name: 'Allemagne', code: '+49' },
  { name: 'Andorre', code: '+376' },
  { name: 'Angola', code: '+244' },
  { name: 'Argentine', code: '+54' },
  { name: 'Arménie', code: '+374' },
  { name: 'Australie', code: '+61' },
  { name: 'Autriche', code: '+43' },
  { name: 'Belgique', code: '+32' },
  { name: 'Bénin', code: '+229' },
  { name: 'Brésil', code: '+55' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Canada', code: '+1' },
  { name: 'Cameroun', code: '+237' },
  { name: 'Chine', code: '+86' },
  { name: 'Côte d’Ivoire', code: '+225' },
  { name: 'Espagne', code: '+34' },
  { name: 'États-Unis', code: '+1' },
  { name: 'France', code: '+33' },
  { name: 'Italie', code: '+39' },
  { name: 'Maroc', code: '+212' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Royaume-Uni', code: '+44' },
  { name: 'Sénégal', code: '+221' },
  { name: 'Suisse', code: '+41' },
  { name: 'Tunisie', code: '+216' },
].sort((a, b) => a.name.localeCompare(b.name));

const professions = [
  "Développeur",
  "Designer",
  "Enseignant",
  "Médecin",
  "Commerçant",
  "Autre",
];

// Transformation pour react-select
const countryOptions = countries.map(c => ({ value: c.code, label: `${c.name} (${c.code})` }));
const professionOptions = professions.map(p => ({ value: p, label: p }));

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    country_code: "",
    phone: "",
    address: "",
    postal_code: "",
    profession: "",
    customProfession: "",
    gender: "",
    invite_code: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected: any, name: string) => {
    if (name === "profession" && selected.value !== "Autre") {
      setFormData(prev => ({ ...prev, profession: selected.value, customProfession: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: selected.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const finalData = {
      full_name: formData.full_name,
      email: formData.email,
      country_code: formData.country_code,
      phone_number: formData.phone,
      address: formData.address,
      postal_code: formData.postal_code,
      profession: formData.profession === "Autre" ? formData.customProfession : formData.profession,
      gender: formData.gender,
      invitation_code: formData.invite_code,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    try {
      await api.post("/register", finalData);
      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setFormData({
        full_name: "",
        email: "",
        country_code: "",
        phone: "",
        address: "",
        postal_code: "",
        profession: "",
        customProfession: "",
        gender: "",
        invite_code: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Créer un compte
        </h2>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {/* Modal pour inscription réussie */}
        {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">✔ Inscription réussie !</h3>
            <p className="text-gray-700 mb-6">
                Votre compte a été créé avec succès.
            </p>
            <div className="flex justify-center gap-4">
                <a
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                Accueil
                </a>
                <a
                href="/login"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                Se connecter
                </a>
            </div>
            <button onClick={() => setSuccess(null)}>×</button>
            </div>
        </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-xl" /> <span>Continuer avec Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-3 w-full bg-[#1877F2] text-white py-2 px-4 rounded-lg shadow hover:bg-[#155dce] transition"
          >
            <FaFacebookF className="text-lg" />{" "}
            <span>Continuer avec Facebook</span>
          </button>
        </div>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative bg-white px-3 text-gray-500">ou</div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            type="text"
            placeholder="Nom complet"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />

          <div className="flex gap-4">
            <div className="w-1/3">
              <Select
                options={countryOptions}
                placeholder="Code pays"
                value={countryOptions.find(c => c.value === formData.country_code)}
                onChange={(selected) => handleSelectChange(selected, "country_code")}
                isSearchable
              />
            </div>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Numéro de téléphone"
              className="w-2/3 border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            type="text"
            placeholder="Adresse"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />

          <input
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            type="text"
            placeholder="Code postal"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />

          <Select
            options={professionOptions}
            placeholder="Sélectionnez votre profession"
            value={professionOptions.find(p => p.value === formData.profession)}
            onChange={(selected) => handleSelectChange(selected, "profession")}
          />

          {formData.profession === "Autre" && (
            <input
              name="customProfession"
              value={formData.customProfession}
              onChange={handleChange}
              type="text"
              placeholder="Précisez votre profession"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          )}

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                required
              />{" "}
              Homme
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                required
              />{" "}
              Femme
            </label>
          </div>

          <input
            name="invite_code"
            value={formData.invite_code}
            onChange={handleChange}
            type="text"
            placeholder="Code d'invitation"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Mot de passe"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            type="password"
            placeholder="Confirmer le mot de passe"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
