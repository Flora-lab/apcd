import petiteImg1 from "../../assets/petite-Img1.jpg";
import petiteImg2 from "../../assets/petite-Img2.jpg";

const AboutSection = () => {
  return (
    <section className="py-6 bg-white px-6 mb-55 md:px-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">À propos de l'APCD</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
        L'APCD est une organisation dédiée à aider les professionnels camerounais de la diaspora à se connecter, se soutenir et réussir ensemble. Notre mission est de promouvoir la collaboration, l'éducation et l'entraide entre nos membres, afin de bâtir un avenir prospère pour tous.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <img src={petiteImg1} alt="Rencontres" className="rounded-xl shadow-md object-cover h-80 w-full" />
        <img src={petiteImg2} alt="Conférence" className="rounded-xl shadow-md object-cover h-80 w-full" />
      </div>
    </section>
  );
};

export default AboutSection;
