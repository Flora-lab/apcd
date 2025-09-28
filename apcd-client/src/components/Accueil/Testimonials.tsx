import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Paul Tchatchoua',
    role: 'Entrepreneur Camerounais en France',
    message: "L'association m’a permis de connecter avec des leaders engagés et de lancer mon projet social en un temps record.",
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Marie Ngo Mbe',
    role: 'Étudiante au Canada',
    message: "Grâce à leurs programmes éducatifs, j’ai trouvé un mentor et une communauté qui me pousse à réussir.",
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Jean-Claude Ebogo',
    role: 'Consultant IT en Belgique',
    message: "Une communauté qui inspire et soutient. L’ambiance est fraternelle, et les opportunités sont concrètes.",
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    name: 'Aminata Bamba',
    role: 'Ingénieure à Berlin',
    message: "Rejoindre l'association a été l'une de mes meilleures décisions. J'ai rencontré des amis et des partenaires pour la vie.",
    image: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
  {
    name: 'Marc Djoumessi',
    role: 'Coach en développement personnel',
    message: "J’ai pu animer des ateliers enrichissants et toucher des jeunes de la diaspora motivés et curieux.",
    image: 'https://randomuser.me/api/portraits/men/81.jpg',
  },
  {
    name: 'Clarisse Ebang',
    role: 'Chercheuse en Suisse',
    message: "Une plateforme qui valorise notre identité et pousse vers l’excellence. Je recommande vivement.",
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Ils témoignent</h2>
        <p className="text-gray-500 text-lg">Des membres de la diaspora partagent leur expérience.</p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="!pb-16"
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">“{t.message}”</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination style override */}
      <style>{`
        .swiper-pagination {
          margin-top: 20px;
          position: relative;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
