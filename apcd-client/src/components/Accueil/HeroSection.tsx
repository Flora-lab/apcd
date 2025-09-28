import Button from "../ui/button";
import { motion } from "framer-motion";
import Background1 from "../../assets/Background1.jpg";
import petiteImg1 from "../../assets/petite-Img1.jpg";
import petiteImg2 from "../../assets/petite-Img2.jpg";
import { FaUsers, FaHandsHelping, FaRocket } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div
      className="relative min-h-[70vh] md:min-h-[80vh] px-6 md:px-18 py-12 flex flex-col justify-center overflow-hidden text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${Background1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10">
        <main className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Text */}
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              Bienvenue à l'APCD
            </h2>
            <p className="text-lg md:text-xl text-white mb-6">
              Rejoignez l'Association des Professionnels Camerounais de la Diaspora pour une communauté plus forte et unie, axée sur l'autonomisation, l'éducation et la collaboration.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2">
                <FaRocket /> En savoir plus
              </Button>
              <Button
                variant="outline"
                className="border-red-500 bg-white text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <FaHandsHelping /> Rejoindre nos groupes
              </Button>
            </div>
          </div>

          {/* Right Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-sm sm:max-w-md w-full mt-8 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden transform-gpu transition-transform duration-300 hover:scale-110 rounded-[40%_0%_40%_40%/40%_40%_0%_0%] shadow-xl"
            >
              <img src={petiteImg1} alt="Networking" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="bg-orange-100 p-6 rounded-[10%] flex flex-col items-center justify-center text-center shadow-lg transform-gpu transition-transform duration-300 hover:scale-110"
            >
              <p className="text-orange-700 font-semibold text-sm">EASY TO USE</p>
              <div className="text-orange-600 text-3xl mt-2"><FaRocket /></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="bg-green-100 p-6 rounded-[10%] flex flex-col items-center justify-center text-center shadow-lg transform-gpu transition-transform duration-300 hover:scale-110"
            >
              <p className="text-green-700 font-semibold text-sm">TRUSTED BY USERS</p>
              <div className="text-green-600 text-3xl mt-2"><FaUsers /></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="rounded-[40%_60%_60%_40%/50%_40%_60%_50%] overflow-hidden w-full aspect-square shadow-lg transform-gpu transition-transform duration-300 hover:scale-110"
            >
              <img src={petiteImg2} alt="Collaboration" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HeroSection;
