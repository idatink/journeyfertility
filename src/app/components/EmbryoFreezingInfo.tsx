import { ArrowLeft, Check, Clock, DollarSign, Users, ChevronDown, Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import embryoHeroImage from '../../assets/embryofreezehero.jpg';
import img_151949402689280bbd2d6fd0d from '../../assets/photos/photo-1519494026892-80bbd2d6fd0d.jpg';
import img_1538108149393fbbd81895907 from '../../assets/photos/photo-1538108149393-fbbd81895907.jpg';
import img_1551076805e1869033e561 from '../../assets/photos/photo-1551076805-e1869033e561.jpg';
import img_1586773860418d37222d8fce3 from '../../assets/photos/photo-1586773860418-d37222d8fce3.jpg';
import img_15873510217593e566b6af7cc from '../../assets/photos/photo-1587351021759-3e566b6af7cc.jpg';
import img_1632833239869a37e3a5806d2 from '../../assets/photos/photo-1632833239869-a37e3a5806d2.jpg';

interface EmbryoFreezingInfoProps {
  onBack: () => void;
  onSearchClinics: () => void;
  onTakeQuiz: () => void;
  scrollToClinics?: boolean;
}

export function EmbryoFreezingInfo({ onBack, onSearchClinics, onTakeQuiz, scrollToClinics }: EmbryoFreezingInfoProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState('all');
  const clinicsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToClinics && clinicsRef.current) {
      setTimeout(() => {
        clinicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [scrollToClinics]);

  const cities = ['All cities', 'New York', 'Los Angeles', 'San Francisco', 'Boston', 'Chicago', 'Barcelona', 'Prague', 'London', 'Istanbul'];

  const clinics = [
    {
      id: 1,
      name: 'Reproductive Health Center',
      city: 'New York',
      image: img_151949402689280bbd2d6fd0d,
      rating: 4.8,
      reviews: 342,
      distance: '1.2 miles from center',
      description: 'Advanced embryo cryopreservation with long-term storage options',
      features: ['Free consultation', 'Payment plans', 'Insurance accepted'],
      price: 15000,
      priceDetails: 'Full IVF + embryo freezing'
    },
    {
      id: 2,
      name: 'Pacific Fertility Center',
      city: 'San Francisco',
      image: img_1632833239869a37e3a5806d2,
      rating: 4.9,
      reviews: 456,
      distance: '0.8 miles from center',
      description: 'State-of-the-art embryo lab with PGT testing available',
      features: ['24/7 support', 'PGT available', 'LGBTQ+ friendly'],
      price: 16500,
      priceDetails: 'Full IVF + embryo freezing'
    },
    {
      id: 3,
      name: 'Boston IVF - Embryo Preservation',
      city: 'Boston',
      image: img_1551076805e1869033e561,
      rating: 4.7,
      reviews: 289,
      distance: '2.1 miles from center',
      description: 'Leading embryology lab with decades of experience',
      features: ['Payment plans', 'Insurance accepted', 'EMI available'],
      price: 14800,
      priceDetails: 'Full IVF + embryo freezing'
    },
    {
      id: 4,
      name: 'Barcelona IVF',
      city: 'Barcelona',
      image: img_1538108149393fbbd81895907,
      rating: 4.9,
      reviews: 523,
      distance: '1.5 km from center',
      description: 'European excellence in embryo preservation and storage',
      features: ['EU certified', 'Travel packages', 'Donor sperm available'],
      price: 6500,
      priceDetails: 'Full IVF + embryo freezing'
    },
    {
      id: 5,
      name: 'Jinemed Hospital',
      city: 'Istanbul',
      image: img_15873510217593e566b6af7cc,
      rating: 4.8,
      reviews: 612,
      distance: '3.2 km from center',
      description: 'Comprehensive embryo services with excellent success rates',
      features: ['All-inclusive packages', 'Airport transfer', 'English speaking'],
      price: 4200,
      priceDetails: 'Full IVF + embryo freezing'
    },
    {
      id: 6,
      name: 'Chicago Fertility Clinic',
      city: 'Chicago',
      image: img_1586773860418d37222d8fce3,
      rating: 4.6,
      reviews: 198,
      distance: '1.8 miles from center',
      description: 'Advanced vitrification techniques for optimal embryo preservation',
      features: ['Free consultation', 'Payment plans', 'Weekend appointments'],
      price: 15200,
      priceDetails: 'Full IVF + embryo freezing'
    }
  ];

  const filteredClinics = selectedCity === 'all' 
    ? clinics 
    : clinics.filter(clinic => clinic.city === selectedCity);

  const faqs = [
    {
      question: "What's the difference between freezing eggs vs embryos?",
      answer: "Eggs are unfertilized and frozen individually. Embryos are created by fertilizing eggs with sperm in a lab, then frozen at various stages (typically day 5-6 blastocyst stage). Embryos have higher survival and success rates upon thawing compared to frozen eggs because they've already been fertilized and developed."
    },
    {
      question: "How long can embryos be frozen?",
      answer: "Embryos can be safely stored for many years - even decades. The longest reported successful pregnancy from a frozen embryo was after 27 years of storage. The vitrification process preserves embryos in a suspended state where no biological aging occurs."
    },
    {
      question: "What are the success rates with frozen embryos?",
      answer: "Frozen embryos have excellent success rates. Modern vitrification techniques result in 90-95% embryo survival rates upon thawing. Live birth rates per frozen embryo transfer are typically 40-50% for women under 35, and 30-40% for women 35-40, comparable to fresh embryo transfers."
    },
    {
      question: "Do I need a partner to freeze embryos?",
      answer: "You can freeze embryos using your partner's sperm, a known donor's sperm, or sperm from a sperm bank. Many single women and LGBTQ+ couples choose to freeze embryos using donor sperm to have genetically-related children in the future."
    },
    {
      question: "Can I freeze embryos during IVF treatment?",
      answer: "Yes, embryo freezing is commonly done during IVF. If you have more high-quality embryos than needed for one transfer, the extras are frozen for future use. This allows multiple pregnancy attempts from one egg retrieval cycle and is included in most IVF treatment plans."
    },
    {
      question: "What happens to unused frozen embryos?",
      answer: "You have several options: keep them frozen for future use, donate them to another family, donate them to research, or have them thawed and discarded. Most clinics require you to specify your wishes in advance through consent forms."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-[#2F3440] overflow-hidden">
        <ImageWithFallback
          src={embryoHeroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45"
        />
        <ImageWithFallback
          src={embryoHeroImage}
          alt="Embryo Freezing"
          className="absolute right-[7%] top-1/2 -translate-y-1/2 h-[400px] w-[290px] object-cover rounded-2xl hidden lg:block"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10">
          <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-between py-8">
            <Button
              variant="ghost"
              className="w-fit text-white hover:text-white hover:bg-white/20"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="pb-12">
              <h1 className="text-5xl md:text-6xl text-white mb-4">
                Embryo Freezing
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mb-6">
                Preserve fertilized embryos for future family building. Higher success rates, more flexibility.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
                  onClick={() => clinicsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Find Embryo Storage Facilities
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/90 hover:bg-white border-0 text-[#A8BEEB]"
                  onClick={onTakeQuiz}
                >
                  Take Self-Assessment Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Overview Section */}
        <div className="mb-16">
          <h2 className="text-4xl mb-6">What is Embryo Freezing?</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Embryo freezing (embryo cryopreservation) is the process of creating embryos through fertilization of eggs with sperm in a laboratory, then freezing them for future use. These frozen embryos can be stored for years and later thawed for transfer into the uterus when you're ready to pursue pregnancy.
            </p>
            <p>
              Embryo freezing offers higher success rates than egg freezing because the embryos have already successfully fertilized and developed. It's an excellent option for couples, individuals with a sperm source, or anyone planning future IVF cycles.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">How Embryo Freezing Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Egg Retrieval",
                description: "Undergo ovarian stimulation (10-14 days) followed by egg retrieval. Multiple mature eggs are collected through a minor surgical procedure."
              },
              {
                step: "2",
                title: "Fertilization",
                description: "Eggs are fertilized with sperm (partner or donor) in the lab using standard IVF or ICSI. Fertilization is confirmed within 24 hours."
              },
              {
                step: "3",
                title: "Embryo Development",
                description: "Embryos are cultured for 5-6 days to reach blastocyst stage. Embryologists monitor their development and grade their quality."
              },
              {
                step: "4",
                title: "Freezing & Storage",
                description: "High-quality embryos are vitrified (flash-frozen) and stored in liquid nitrogen at -196°C until you're ready for embryo transfer."
              }
            ].map((item) => (
              <div key={item.step} className="bg-[#EEF2FE] rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-[#A8BEEB] text-white flex items-center justify-center text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Who It's For */}
        <div className="mb-16 bg-[#EEF2FE] rounded-2xl p-8 md:p-12">
          <h2 className="text-4xl mb-8">Who Should Consider Embryo Freezing?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Couples who want to preserve fertility together",
              "People undergoing IVF with extra embryos",
              "Those wanting higher success rates than egg freezing alone",
              "Individuals using donor sperm who want to preserve embryos",
              "Couples where one partner will undergo medical treatment",
              "LGBTQ+ couples building their family through IVF",
              "People who want multiple children from one retrieval cycle",
              "Those with religious or ethical preferences for embryo creation"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#A8BEEB] flex-shrink-0 mt-1" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinics Section */}
        <div ref={clinicsRef} className="mb-16">
          <h2 className="text-4xl mb-8">Embryo Freezing Clinics</h2>
          
          {/* City Filter */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === 'All cities' ? 'all' : city)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  (city === 'All cities' && selectedCity === 'all') || city === selectedCity
                    ? 'bg-[#A8BEEB] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Clinic Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredClinics.map((clinic) => (
              <div key={clinic.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl flex-1 pr-4">{clinic.name}</h3>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#A8BEEB] text-white flex-shrink-0">
                    <span className="text-2xl">{clinic.rating}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-[#A8BEEB] fill-current" />
                    <span className="text-sm">
                      {Math.round(clinic.rating * 10)}% strongly recommend
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {clinic.reviews} Reviews
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    {clinic.city} • {clinic.distance}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {clinic.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[#EEF2FE] text-gray-700 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl mb-1">
                        ${clinic.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {clinic.priceDetails}
                      </div>
                    </div>
                    <Button className="bg-[#A8BEEB] hover:bg-[#6B7FC7] text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClinics.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No clinics found in {selectedCity}. Try selecting a different city.
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-[#CBD8F5] rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#EEF2FE] transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="text-lg pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#A8BEEB] flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#A8BEEB] to-[#6B7FC7] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Preserve Your Embryos?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Connect with clinics that offer embryo freezing and storage services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-[#A8BEEB] hover:bg-white/90"
              onClick={onSearchClinics}
            >
              Search Embryo Storage Facilities
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={onTakeQuiz}
            >
              Take Self-Assessment Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}