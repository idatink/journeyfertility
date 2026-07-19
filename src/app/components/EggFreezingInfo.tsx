import { ArrowLeft, Check, Clock, DollarSign, Users, ChevronDown, Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import eggFreezingImage from '../../assets/eggfreezinghero.jpg';

interface EggFreezingInfoProps {
  onBack: () => void;
  onSearchClinics: () => void;
  onTakeQuiz: () => void;
  scrollToClinics?: boolean;
}

export function EggFreezingInfo({ onBack, onSearchClinics, onTakeQuiz, scrollToClinics }: EggFreezingInfoProps) {
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
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      rating: 4.8,
      reviews: 342,
      distance: '1.2 miles from center',
      description: 'Premier fertility clinic with state-of-the-art vitrification technology',
      features: ['Free consultation', 'Payment plans', 'Insurance accepted'],
      price: 11500,
      priceDetails: 'Full egg freezing cycle'
    },
    {
      id: 2,
      name: 'Pacific Fertility Center',
      city: 'San Francisco',
      image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&q=80',
      rating: 4.9,
      reviews: 456,
      distance: '0.8 miles from center',
      description: 'Leading edge reproductive care with personalized treatment plans',
      features: ['24/7 support', 'Free consultation', 'LGBTQ+ friendly'],
      price: 12800,
      priceDetails: 'Full egg freezing cycle'
    },
    {
      id: 3,
      name: 'Boston IVF - Egg Freezing',
      city: 'Boston',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
      rating: 4.7,
      reviews: 289,
      distance: '2.1 miles from center',
      description: 'Internationally recognized fertility specialists with decades of experience',
      features: ['Payment plans', 'Insurance accepted', 'EMI available'],
      price: 10900,
      priceDetails: 'Full egg freezing cycle'
    },
    {
      id: 4,
      name: 'Barcelona IVF',
      city: 'Barcelona',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
      rating: 4.9,
      reviews: 523,
      distance: '1.5 km from center',
      description: 'European leader in fertility preservation with multilingual staff',
      features: ['EU certified', 'Travel packages', 'Free consultation'],
      price: 4500,
      priceDetails: 'Full egg freezing cycle'
    },
    {
      id: 5,
      name: 'Jinemed Hospital',
      city: 'Istanbul',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80',
      rating: 4.8,
      reviews: 612,
      distance: '3.2 km from center',
      description: 'Premier women\'s health center with excellent success rates',
      features: ['All-inclusive packages', 'Airport transfer', 'English speaking'],
      price: 2800,
      priceDetails: 'Full egg freezing cycle'
    },
    {
      id: 6,
      name: 'Chicago Fertility Clinic',
      city: 'Chicago',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
      rating: 4.6,
      reviews: 198,
      distance: '1.8 miles from center',
      description: 'Compassionate care with cutting-edge reproductive technology',
      features: ['Free consultation', 'Payment plans', 'Weekend appointments'],
      price: 11200,
      priceDetails: 'Full egg freezing cycle'
    }
  ];

  const filteredClinics = selectedCity === 'all' 
    ? clinics 
    : clinics.filter(clinic => clinic.city === selectedCity);

  const faqs = [
    {
      question: "What is the best age to freeze eggs?",
      answer: "The ideal age to freeze eggs is typically in your late 20s to early 30s. Women under 35 generally have better egg quality and quantity, leading to higher success rates. However, egg freezing can still be beneficial for women in their mid-to-late 30s."
    },
    {
      question: "How many eggs should I freeze?",
      answer: "Experts recommend freezing 15-20 mature eggs to have a good chance of one successful pregnancy. Depending on your age and ovarian reserve, this may require one or multiple egg freezing cycles."
    },
    {
      question: "How long can eggs be frozen?",
      answer: "Eggs can be safely frozen for many years - potentially decades. Studies show no difference in success rates between eggs frozen for 1 year versus 10+ years. The limiting factor is typically the age at which the eggs were frozen, not storage duration."
    },
    {
      question: "What is the success rate of frozen eggs?",
      answer: "Success rates vary by age. For women under 35, each thawed egg has about a 4-12% chance of resulting in pregnancy. For women 35-37, it's 3-9%, and for women 38-40, it's 2-6%. Multiple eggs significantly increase overall success probability."
    },
    {
      question: "Does egg freezing guarantee pregnancy?",
      answer: "No, egg freezing does not guarantee future pregnancy. It's an insurance policy that preserves your current fertility potential. Success depends on factors like age at freezing, number of eggs frozen, egg quality, and future partner's sperm quality."
    },
    {
      question: "Is the egg freezing process painful?",
      answer: "Most women report mild discomfort rather than pain. The hormone injections can cause bloating and mood changes. The egg retrieval procedure is done under sedation, so you won't feel pain during it, though you may experience cramping afterward."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-[#2F3440] overflow-hidden">
        <img
          src={eggFreezingImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45"
        />
        <img
          src={eggFreezingImage}
          alt="Egg Freezing"
          className="absolute right-[7%] top-1/2 -translate-y-1/2 h-[400px] w-[290px] object-cover rounded-2xl hidden lg:block"
          style={{ objectPosition: '50% 35%' }}
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
                Egg Freezing
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mb-6">
                Take control of your reproductive timeline. Preserve your fertility for when you're ready.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-[#F8AD7C] hover:bg-[#F2955F] text-[#2F3440] font-semibold"
                  onClick={onSearchClinics}
                >
                  Find Egg Freezing Clinics
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
          <h2 className="text-4xl mb-6">What is Egg Freezing?</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Egg freezing (oocyte cryopreservation) is a process where a woman's eggs are extracted, frozen, and stored for future use. This allows you to preserve your eggs at their current age and quality, giving you more control over when you start a family.
            </p>
            <p>
              Whether you're focusing on your career, haven't found the right partner, have medical reasons, or simply want more time to decide, egg freezing provides flexibility and peace of mind about your reproductive future.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">How Egg Freezing Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Initial Consultation",
                description: "Meet with a fertility specialist to discuss your goals, undergo testing (AMH, ultrasound), and create a personalized treatment plan."
              },
              {
                step: "2",
                title: "Ovarian Stimulation",
                description: "Take hormone medications for 10-14 days to stimulate your ovaries to produce multiple eggs. Regular monitoring via ultrasound and bloodwork."
              },
              {
                step: "3",
                title: "Egg Retrieval",
                description: "A 20-30 minute procedure under light sedation where eggs are collected from your ovaries using ultrasound-guided needle aspiration."
              },
              {
                step: "4",
                title: "Freezing & Storage",
                description: "Mature eggs are flash-frozen using vitrification and stored in liquid nitrogen at -196°C until you're ready to use them."
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
          <h2 className="text-4xl mb-8">Who Should Consider Egg Freezing?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Women in their late 20s to mid-30s who want to delay parenthood",
              "Those focusing on career or educational goals",
              "People who haven't found the right partner yet",
              "Women with medical conditions that may affect fertility",
              "Those about to undergo cancer treatment (chemotherapy/radiation)",
              "Women with family history of early menopause",
              "People with endometriosis or PCOS",
              "Anyone wanting reproductive autonomy and flexibility"
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
              <p className="text-gray-600 mb-4">One cycle takes approximately 2-3 weeks from start to egg retrieval</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Stimulation: 10-14 days</li>
                <li>• Retrieval: 1 day procedure</li>
                <li>• Recovery: 1-2 days</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#CBD8F5] rounded-xl p-6">
              <DollarSign className="w-10 h-10 text-[#A8BEEB] mb-4" />
              <h3 className="text-2xl mb-2">Cost Range</h3>
              <p className="text-gray-600 mb-4">Average investment per cycle (costs vary by location)</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Cycle cost: $8,000-$15,000</li>
                <li>• Medications: $3,000-$5,000</li>
                <li>• Storage: $500-$1,000/year</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#CBD8F5] rounded-xl p-6">
              <Users className="w-10 h-10 text-[#A8BEEB] mb-4" />
              <h3 className="text-2xl mb-2">Success Rates</h3>
              <p className="text-gray-600 mb-4">Live birth rate per thawed egg (varies by age at freezing)</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Under 35: 4-12% per egg</li>
                <li>• Ages 35-37: 3-9% per egg</li>
                <li>• Ages 38-40: 2-6% per egg</li>
              </ul>
            </div>
          </div>
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

        {/* Clinics Section */}
        <div ref={clinicsRef} className="mb-16">
          <h2 className="text-4xl mb-8">Egg Freezing Clinics</h2>
          
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

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#A8BEEB] to-[#6B7FC7] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Explore clinics in your area or take our self-assessment quiz to understand your fertility options
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-[#A8BEEB] hover:bg-white/90"
              onClick={onSearchClinics}
            >
              Search Egg Freezing Clinics
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