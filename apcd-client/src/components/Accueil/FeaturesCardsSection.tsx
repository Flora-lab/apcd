import { motion } from "framer-motion";
import networking from "../../assets/networking.jpg";
import experience from "../../assets/experience.jpg";
import news from "../../assets/news.jpg";
import collaboration from "../../assets/collaboration.jpg";

const features = [
  {
    title: "Rencontrer du monde",
    description:
      "Élargissez votre réseau avec des professionnels de la diaspora partageant les mêmes valeurs.",
    image: networking,
  },
  {
    title: "Partager votre expérience",
    description:
      "Faites entendre votre voix et inspirez d'autres membres avec votre parcours.",
    image: experience,
  },
  {
    title: "Rester à l'affût des dernières nouvelles",
    description:
      "Recevez des mises à jour en temps réel sur les événements, projets et initiatives de la communauté.",
    image: news,
  },
  {
    title: "Collaborer sur des projets",
    description:
      "Travaillez ensemble pour avoir un impact réel au sein de la diaspora et au pays.",
    image: collaboration,
  },
];

const FeaturesCardsSection = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        Pourquoi rejoindre l'APCD ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Titre par défaut */}
            <div className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 group-hover:opacity-0 px-4 text-center">
              <h3 className="text-white text-2xl font-semibold drop-shadow-md">
                {item.title}
              </h3>
            </div>

            {/* Description au hover */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 text-center">
              <p className="text-xl text-gray-100 drop-shadow-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    
  );
};

export default FeaturesCardsSection;
