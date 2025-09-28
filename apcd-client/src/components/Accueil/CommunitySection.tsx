// components/CommunitySection.jsx
import ReactPlayer from 'react-player';
import Button  from "../ui/button"; // Assure-toi que ce chemin est correct

const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/UNICEF_Logo.png/320px-UNICEF_Logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Save_the_Children_logo.svg/320px-Save_the_Children_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/American_Red_Cross_logo.svg/320px-American_Red_Cross_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/d/db/World_Bank_logo.svg",
];

const CommunitySection = () => {
  return (
    <section className="w-full bg-gray-300 py-16 px-4 md:px-12">
      {/* VIDEO */}
      <div className="max-w-5xl mx-auto mt-[-240px] mb-12">
        <div className="overflow-hidden rounded-tl-[80px] rounded-br-[80px] shadow-xl">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=0K6YAVKOIpo"
            width="100%"
            height="360px"
            controls={true}
            
          />
        </div>
      </div>

      {/* TEXTE */}
      <div className="max-w-3xl mx-auto text-center mb-6">
        <p className="text-gray-700 text-lg md:text-xl">
          Découvrez nos services conçus pour accompagner les membres de la diaspora dans leurs projets : mentorat, networking, opportunités d’investissement, et bien plus.
        </p>
      </div>

      {/* BOUTON */}
      <div className="text-center mb-12">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm md:text-base px-6 py-2 rounded-full">
          En savoir plus
        </Button>
      </div>

      {/* CARROUSEL DE LOGOS */}
      <div className="overflow-hidden w-full">
        <div className="animate-scroll flex items-center gap-16 min-w-max">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt={`logo-${idx}`}
              className="h-10 md:h-12 w-auto object-contain"
            />
          ))}
        </div>
      </div>

      {/* CSS Scroll Animation */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CommunitySection;
