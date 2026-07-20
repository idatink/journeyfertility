import { ArrowLeft, Check, Clock, DollarSign, Users, ChevronDown, Heart, Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ivfHeroImage from '../../assets/ivfhero.jpg';
import img_151949402689280bbd2d6fd0d from '../../assets/photos/photo-1519494026892-80bbd2d6fd0d.jpg';
import img_1538108149393fbbd81895907 from '../../assets/photos/photo-1538108149393-fbbd81895907.jpg';
import img_1551076805e1869033e561 from '../../assets/photos/photo-1551076805-e1869033e561.jpg';
import img_1586773860418d37222d8fce3 from '../../assets/photos/photo-1586773860418-d37222d8fce3.jpg';
import img_15873510217593e566b6af7cc from '../../assets/photos/photo-1587351021759-3e566b6af7cc.jpg';
import img_1632833239869a37e3a5806d2 from '../../assets/photos/photo-1632833239869-a37e3a5806d2.jpg';

interface IVFTreatmentInfoProps {
  onBack: () => void;
  onSearchClinics: () => void;
  onTakeQuiz: () => void;
  scrollToClinics?: boolean;
}

export function IVFTreatmentInfo({ onBack, onSearchClinics, onTakeQuiz, scrollToClinics }: IVFTreatmentInfoProps) {
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
      name: 'Reproductive Medicine Associates',
      city: 'New York',
      image: img_151949402689280bbd2d6fd0d,
      rating: 4.9,
      reviews: 567,
      distance: '1.2 miles from center',
      description: 'Leading IVF clinic with cutting-edge technology and exceptional success rates',
      features: ['PGT testing', 'Single embryo transfer', 'Insurance accepted'],
      price: 18500,
      priceDetails: 'Full IVF cycle + medications'
    },
    {
      id: 2,
      name: 'UCSF Center for Reproductive Health',
      city: 'San Francisco',
      image: img_1632833239869a37e3a5806d2,
      rating: 4.9,
      reviews: 623,
      distance: '0.8 miles from center',
      description: 'Academic excellence combined with compassionate personalized care',
      features: ['Research-backed', 'LGBTQ+ friendly', 'Donor programs'],
      price: 19800,
      priceDetails: 'Full IVF cycle + medications'
    },
    {
      id: 3,
      name: 'Boston IVF',
      city: 'Boston',
      image: img_1551076805e1869033e561,
      rating: 4.8,
      reviews: 489,
      distance: '2.1 miles from center',
      description: 'One of the nation\'s largest fertility networks with proven expertise',
      features: ['Multiple locations', 'Payment plans', 'High success rates'],
      price: 17900,
      priceDetails: 'Full IVF cycle + medications'
    },
    {
      id: 4,
      name: 'IVI Barcelona',
      city: 'Barcelona',
      image: img_1538108149393fbbd81895907,
      rating: 4.9,
      reviews: 834,
      distance: '1.5 km from center',
      description: 'World-renowned IVF center with international patient services',
      features: ['EU certified', 'Multilingual staff', 'Travel packages'],
      price: 7500,
      priceDetails: 'Full IVF cycle + medications'
    },
    {
      id: 5,
      name: 'American Hospital IVF Center',
      city: 'Istanbul',
      image: img_15873510217593e566b6af7cc,
      rating: 4.8,
      reviews: 712,
      distance: '3.2 km from center',
      description: 'Premium IVF services with all-inclusive treatment packages',
      features: ['All-inclusive', 'Airport transfer', 'English speaking'],
      price: 5800,
      priceDetails: 'Full IVF cycle + medications'
    },
    {
      id: 6,
      name: 'Chicago IVF',
      city: 'Chicago',
      image: img_1586773860418d37222d8fce3,
      rating: 4.7,
      reviews: 356,
      distance: '1.8 miles from center',
      description: 'Family-focused fertility care with personalized treatment protocols',
      features: ['Free consultation', 'Flexible scheduling', 'EMI available'],
      price: 18200,
      priceDetails: 'Full IVF cycle + medications'
    }
  ];

  const filteredClinics = selectedCity === 'all' 
    ? clinics 
    : clinics.filter(clinic => clinic.city === selectedCity);

  const faqs = [
    {
      question: "What is the success rate of IVF?",
      answer: "IVF success rates vary by age. For women under 35, the live birth rate per cycle is about 40-50%. For ages 35-37, it's 35-40%, ages 38-40 it's 25-30%, and ages 41-42 it's 15-20%. Multiple cycles increase overall chances, and factors like egg quality, sperm quality, and embryo genetics also play significant roles."
    },
    {
      question: "How long does an IVF cycle take?",
      answer: "A complete IVF cycle typically takes 4-6 weeks from start to pregnancy test. This includes 10-14 days of ovarian stimulation, egg retrieval, 3-6 days of embryo development, embryo transfer, and a 10-14 day wait before pregnancy testing. Some protocols may vary in timing."
    },
    {
      question: "Is IVF painful?",
      answer: "Most IVF procedures involve minimal discomfort. Daily hormone injections may cause mild soreness. Egg retrieval is done under sedation, so you won't feel pain during the procedure, though some cramping afterward is normal. Embryo transfer is typically painless and doesn't require anesthesia."
    },
    {
      question: "How many IVF cycles will I need?",
      answer: "Many people achieve pregnancy within 3 IVF cycles. Success depends on age, diagnosis, and individual factors. Some conceive on the first try, while others need multiple cycles. Your doctor will recommend a treatment plan based on your specific situation and may adjust protocols between cycles."
    },
    {
      question: "Can I choose my embryo's characteristics?",
      answer: "No, you cannot select physical traits like eye color or height. However, PGT (preimplantation genetic testing) can screen embryos for chromosomal abnormalities and certain genetic conditions. Gender selection is possible in some countries but is restricted or prohibited in others for non-medical reasons."
    },
    {
      question: "What's the difference between IVF and IUI?",
      answer: "IUI (intrauterine insemination) places sperm directly into the uterus during ovulation, while IVF fertilizes eggs with sperm in a lab and transfers embryos to the uterus. IVF is more complex and expensive but has higher success rates, especially for certain fertility issues like blocked tubes or male factor infertility."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-[#2F3440] overflow-hidden">
        <ImageWithFallback
          src={ivfHeroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45"
        />
        <ImageWithFallback
          src={ivfHeroImage}
          alt="IVF Treatment"
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
                IVF Treatment
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mb-6">
                In vitro fertilization - the most effective assisted reproductive technology available today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
                  onClick={() => clinicsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Find IVF Clinics
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
          <h2 className="text-4xl mb-6">What is IVF?</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              In vitro fertilization (IVF) is a fertility treatment where eggs are retrieved from the ovaries and fertilized with sperm in a laboratory. The resulting embryos are then cultured for several days before one or more are transferred to the uterus, where implantation and pregnancy can occur.
            </p>
            <p>
              IVF has helped millions of people worldwide build their families. It's used for various fertility challenges including blocked fallopian tubes, male factor infertility, endometriosis, unexplained infertility, and age-related fertility decline.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">The IVF Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                title: "Ovarian Stimulation",
                description: "Take hormone medications for 10-14 days to stimulate your ovaries to produce multiple mature eggs."
              },
              {
                step: "2",
                title: "Egg Retrieval",
                description: "A minor surgical procedure under sedation to collect eggs from your ovaries using ultrasound guidance."
              },
              {
                step: "3",
                title: "Fertilization",
                description: "Eggs are combined with sperm in the laboratory. Fertilization is confirmed within 16-18 hours."
              },
              {
                step: "4",
                title: "Embryo Culture",
                description: "Embryos are monitored as they develop over 3-6 days. Quality is assessed before transfer."
              },
              {
                step: "5",
                title: "Embryo Transfer",
                description: "One or more embryos are placed into your uterus. Remaining embryos can be frozen for future use."
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
          <h2 className="text-4xl mb-8">Who Should Consider IVF?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Couples with blocked or damaged fallopian tubes",
              "Male factor infertility (low sperm count or motility)",
              "Women with ovulation disorders or endometriosis",
              "Individuals with genetic disorders seeking PGT screening",
              "Unexplained infertility after other treatments",
              "Women over 40 or with diminished ovarian reserve",
              "Same-sex couples and single parents by choice",
              "Those who've been unsuccessful with IUI or other treatments"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#A8BEEB] flex-shrink-0 mt-1" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Statistics */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">Key Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-[#CBD8F5] rounded-xl p-6">
              <Clock className="w-10 h-10 text-[#A8BEEB] mb-4" />
              <h3 className="text-2xl mb-2">Timeline</h3>
              <p className="text-gray-600 mb-4">One complete cycle takes 4-6 weeks</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Stimulation: 10-14 days</li>
                <li>• Retrieval & Fertilization: 1-2 days</li>
                <li>• Embryo culture: 3-6 days</li>
                <li>• Pregnancy test: 10-14 days post-transfer</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#CBD8F5] rounded-xl p-6">
              <DollarSign className="w-10 h-10 text-[#A8BEEB] mb-4" />
              <h3 className="text-2xl mb-2">Cost Range</h3>
              <p className="text-gray-600 mb-4">Average investment per cycle</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• IVF cycle: $12,000-$20,000</li>
                <li>• Medications: $3,000-$6,000</li>
                <li>• PGT testing: $3,000-$6,000 (optional)</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#CBD8F5] rounded-xl p-6">
              <Heart className="w-10 h-10 text-[#A8BEEB] mb-4" />
              <h3 className="text-2xl mb-2">Success Rates</h3>
              <p className="text-gray-600 mb-4">Live birth rates per cycle by age</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Under 35: 40-50%</li>
                <li>• Age 35-37: 35-40%</li>
                <li>• Age 38-40: 25-30%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinics Section */}
        <div ref={clinicsRef} className="mb-16">
          <h2 className="text-4xl mb-8">IVF Clinics</h2>
          
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
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Start Your IVF Journey?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Connect with top-rated IVF clinics and take the first step toward building your family
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-[#A8BEEB] hover:bg-white/90"
              onClick={onSearchClinics}
            >
              Search IVF Clinics
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