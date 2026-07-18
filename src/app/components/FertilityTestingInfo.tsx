import { ArrowLeft, Check, Clock, DollarSign, Users, ChevronDown, Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FertilityTestingInfoProps {
  onBack: () => void;
  onSearchClinics: () => void;
  onTakeQuiz: () => void;
  scrollToClinics?: boolean;
}

export function FertilityTestingInfo({ onBack, onSearchClinics, onTakeQuiz, scrollToClinics }: FertilityTestingInfoProps) {
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
      name: 'Advanced Fertility Testing Center',
      city: 'New York',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
      rating: 4.8,
      reviews: 234,
      distance: '1.2 miles from center',
      description: 'Comprehensive fertility evaluation with same-day results available',
      features: ['AMH testing', 'Semen analysis', 'Same-day results'],
      price: 850,
      priceDetails: 'Complete fertility panel'
    },
    {
      id: 2,
      name: 'Bay Area Reproductive Lab',
      city: 'San Francisco',
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80',
      rating: 4.9,
      reviews: 312,
      distance: '0.8 miles from center',
      description: 'State-of-the-art diagnostic testing with expert interpretation',
      features: ['Advanced diagnostics', 'Quick turnaround', 'Telemedicine consults'],
      price: 920,
      priceDetails: 'Complete fertility panel'
    },
    {
      id: 3,
      name: 'Boston Fertility Diagnostics',
      city: 'Boston',
      image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&q=80',
      rating: 4.7,
      reviews: 189,
      distance: '2.1 miles from center',
      description: 'Academic medical center with comprehensive testing services',
      features: ['Insurance accepted', 'Walk-in available', 'Expert counseling'],
      price: 780,
      priceDetails: 'Complete fertility panel'
    },
    {
      id: 4,
      name: 'Barcelona Fertility Labs',
      city: 'Barcelona',
      image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&q=80',
      rating: 4.8,
      reviews: 276,
      distance: '1.5 km from center',
      description: 'European-certified fertility testing with multilingual support',
      features: ['EU certified', 'English speaking', 'Fast results'],
      price: 420,
      priceDetails: 'Complete fertility panel'
    },
    {
      id: 5,
      name: 'Istanbul Diagnostic Center',
      city: 'Istanbul',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
      rating: 4.7,
      reviews: 198,
      distance: '3.2 km from center',
      description: 'Affordable comprehensive fertility testing with quality care',
      features: ['Affordable pricing', 'English speaking', 'Full diagnostics'],
      price: 280,
      priceDetails: 'Complete fertility panel'
    },
    {
      id: 6,
      name: 'Chicago Reproductive Testing',
      city: 'Chicago',
      image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80',
      rating: 4.6,
      reviews: 156,
      distance: '1.8 miles from center',
      description: 'Personalized testing protocols with detailed result explanations',
      features: ['Free consultation', 'Flexible hours', 'Insurance billing'],
      price: 820,
      priceDetails: 'Complete fertility panel'
    }
  ];

  const filteredClinics = selectedCity === 'all' 
    ? clinics 
    : clinics.filter(clinic => clinic.city === selectedCity);

  const faqs = [
    {
      question: "How accurate are at-home fertility tests?",
      answer: "At-home fertility tests are highly accurate when performed correctly. They use the same CLIA-certified labs as your doctor's office and measure the exact same biomarkers. Studies show that finger-prick blood samples provide results comparable to traditional venous blood draws. Most major providers (Modern Fertility, Everlywell, LetsGetChecked) have accuracy rates of 95%+ for hormone measurements."
    },
    {
      question: "Do I need a doctor's prescription for at-home fertility testing?",
      answer: "No! One of the major benefits of at-home fertility testing is that you don't need a doctor's referral or prescription. You can order tests directly online and results are reviewed by licensed physicians. However, it's recommended to follow up with a fertility specialist to discuss your results and next steps."
    },
    {
      question: "Are at-home fertility tests covered by insurance or HSA/FSA?",
      answer: "Most at-home fertility test kits are HSA/FSA eligible, meaning you can use pre-tax dollars to purchase them. However, traditional insurance typically doesn't cover at-home testing kits. The good news is that at-home tests are often more affordable than clinic-based testing even without insurance - ranging from $139-$179 compared to $500-$1,000+ at clinics."
    },
    {
      question: "What's the difference between at-home tests and clinic-based testing?",
      answer: "At-home tests measure the same hormones using the same CLIA-certified labs as clinics. The main differences are: (1) Convenience - test at home vs. visiting a clinic, (2) Cost - typically $139-$179 vs. $500-$1,000+, (3) Sample collection - finger prick vs. venous blood draw, (4) Consultation - virtual nurse/physician vs. in-person. Both are accurate, but at-home offers more flexibility and affordability."
    },
    {
      question: "How long does it take to get at-home fertility test results?",
      answer: "Most at-home fertility test results are available within 5-7 days after the lab receives your sample (which takes 1-2 days by mail). Some providers like LetsGetChecked offer results in as little as 2-5 days. Results are delivered through a secure online portal, and many providers include a free consultation with a nurse or physician to review your results."
    },
    {
      question: "What should I do after receiving my at-home test results?",
      answer: "After receiving your results: (1) Review them with the included nurse/physician consultation, (2) Save your results PDF for your records, (3) If results show potential concerns (low AMH, thyroid issues, etc.), schedule a follow-up with a reproductive endocrinologist, (4) Use results to inform family planning decisions or next steps like egg freezing or IVF. Most at-home test providers can help connect you with specialists."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gray-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1579154341906-48e37b8b2b7d?w=1200&q=80"
          alt="Fertility Testing"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
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
                Fertility Testing
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mb-6">
                Understand your reproductive health with comprehensive fertility evaluations and diagnostics.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-[#f7f775] hover:bg-[#e9e95c] text-[#313131] font-semibold"
                  onClick={() => clinicsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Find Testing Centers
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/90 hover:bg-white border-0 text-[#83835B]"
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
          <h2 className="text-4xl mb-6">At-Home Fertility Testing: Convenient & Accessible</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              At-home fertility testing has revolutionized how people understand their reproductive health. Using simple finger-prick blood samples or saliva collection, you can now assess key fertility markers from the comfort of your home. Results are typically available within 5-7 days through a secure online portal, often with access to nurses or fertility specialists for result interpretation.
            </p>
            <p>
              These tests measure the same biomarkers as clinic-based testing but offer greater convenience, privacy, and affordability. Most kits are HSA/FSA eligible and don't require insurance pre-authorization or doctor referrals.
            </p>
          </div>
        </div>

        {/* At-Home Test Providers */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">Popular At-Home Test Kits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Modern Fertility Hormone Test",
                price: "$159",
                features: [
                  "Tests 9+ hormones including AMH, FSH, TSH",
                  "Results in 7-10 days via online portal",
                  "Free 1-on-1 consult with fertility nurse",
                  "Personalized fertility insights report",
                  "HSA/FSA eligible",
                  "Free shipping both ways"
                ],
                badge: "Most Popular"
              },
              {
                title: "Everlywell Women's Fertility Test",
                price: "$149",
                features: [
                  "Measures AMH, TSH, fT4, and more",
                  "Physician-reviewed results",
                  "Results in 5-7 days",
                  "Optional telehealth consultation",
                  "CLIA-certified labs",
                  "HSA/FSA eligible"
                ],
                badge: "Best Value"
              },
              {
                title: "LetsGetChecked Ovarian Reserve Test",
                price: "$139",
                features: [
                  "AMH testing with nurse support",
                  "Dedicated care team included",
                  "Results within 2-5 days",
                  "Discreet home delivery",
                  "Free follow-up consultations",
                  "CLIA-certified testing"
                ],
                badge: "Fastest Results"
              },
              {
                title: "myLAB Box At Home Fertility Test",
                price: "$179",
                features: [
                  "Comprehensive panel: AMH, FSH, LH, E2",
                  "Results in 2-5 days",
                  "Telemedicine consultation included",
                  "Mobile app tracking",
                  "Same-day shipping available",
                  "Lab certified & HIPAA compliant"
                ],
                badge: "Most Comprehensive"
              }
            ].map((kit, idx) => (
              <div key={idx} className="bg-[#F1F1E4] rounded-xl p-6 relative">
                {kit.badge && (
                  <div className="absolute top-4 right-4 bg-[#83835B] text-white px-3 py-1 rounded-full text-sm">
                    {kit.badge}
                  </div>
                )}
                <h3 className="text-2xl mb-2">{kit.title}</h3>
                <p className="text-3xl text-[#83835B] mb-4">{kit.price}</p>
                <ul className="space-y-3">
                  {kit.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#83835B] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 bg-gradient-to-br from-[#EDECD4] to-[#F1F1E4] rounded-2xl p-8 md:p-12">
          <h2 className="text-4xl mb-8">How At-Home Testing Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Order Your Kit",
                description: "Choose your test online and receive it in 3-5 days. Most kits are HSA/FSA eligible."
              },
              {
                step: "2",
                title: "Collect Sample",
                description: "Simple finger-prick blood test at home. Takes just 5 minutes. Detailed instructions included."
              },
              {
                step: "3",
                title: "Mail It Back",
                description: "Use prepaid shipping label. Drop in any mailbox. Labs receive within 1-2 days."
              },
              {
                step: "4",
                title: "Get Results Online",
                description: "View results in 5-7 days via secure portal. Includes nurse consultation and next steps."
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-[#83835B] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Tests */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">What Do At-Home Tests Measure?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Essential Hormone Panel",
                tests: [
                  "AMH (Anti-Müllerian Hormone) - egg count/ovarian reserve",
                  "FSH (Follicle Stimulating Hormone) - ovarian function",
                  "LH (Luteinizing Hormone) - ovulation tracking",
                  "Estradiol (E2) - egg quality & development",
                  "TSH (Thyroid) - metabolism & reproductive health",
                  "Prolactin - hormone balance affecting fertility"
                ]
              },
              {
                title: "Advanced Add-Ons",
                tests: [
                  "Progesterone - ovulation confirmation",
                  "Testosterone - PCOS screening",
                  "Free T3/T4 - comprehensive thyroid panel",
                  "Vitamin D - impacts egg quality & implantation",
                  "HbA1c - blood sugar & metabolic health",
                  "fT4 (Free Thyroxine) - detailed thyroid function"
                ]
              }
            ].map((category, idx) => (
              <div key={idx} className="bg-[#F1F1E4] rounded-xl p-6">
                <h3 className="text-2xl mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.tests.map((test, testIdx) => (
                    <li key={testIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#83835B] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{test}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Who It's For */}
        <div className="mb-16 bg-[#F1F1E4] rounded-2xl p-8 md:p-12">
          <h2 className="text-4xl mb-8">Who Should Use At-Home Fertility Testing?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Women 25-45 wanting to understand their fertility status",
              "Couples trying to conceive for 6-12 months",
              "Women over 35 planning to have children",
              "People with irregular or absent periods",
              "Those with a history of pelvic infections or STIs",
              "Individuals with endometriosis or PCOS",
              "Men with prior reproductive health issues",
              "Anyone planning to freeze eggs or sperm",
              "People wanting to understand their fertility status"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-[#83835B] flex-shrink-0 mt-1" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Information */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">Key Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-[#C9C8B2] rounded-xl p-6">
              <Clock className="w-10 h-10 text-[#83835B] mb-4" />
              <h3 className="text-2xl mb-2">Timeline</h3>
              <p className="text-gray-600 mb-4">Testing schedule and results</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Initial consultation: 30-60 min</li>
                <li>• Blood tests: 15-30 min</li>
                <li>• Results: 2-7 days</li>
                <li>• Follow-up: 1-2 weeks</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#C9C8B2] rounded-xl p-6">
              <DollarSign className="w-10 h-10 text-[#83835B] mb-4" />
              <h3 className="text-2xl mb-2">Cost Range</h3>
              <p className="text-gray-600 mb-4">Average testing costs</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Basic panel: $200-$400</li>
                <li>• Comprehensive: $500-$1,000</li>
                <li>• Specialized tests: $150-$500 each</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-[#C9C8B2] rounded-xl p-6">
              <Users className="w-10 h-10 text-[#83835B] mb-4" />
              <h3 className="text-2xl mb-2">For Both Partners</h3>
              <p className="text-gray-600 mb-4">Testing for couples</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Both partners tested together</li>
                <li>• More comprehensive insight</li>
                <li>• Better treatment planning</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinics Section */}
        <div ref={clinicsRef} className="mb-16">
          <h2 className="text-4xl mb-8">Fertility Testing Centers</h2>
          
          {/* City Filter */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === 'All cities' ? 'all' : city)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  (city === 'All cities' && selectedCity === 'all') || city === selectedCity
                    ? 'bg-[#83835B] text-white'
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
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#83835B] text-white flex-shrink-0">
                    <span className="text-2xl">{clinic.rating}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-[#83835B] fill-current" />
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
                        className="px-2 py-1 bg-[#F1F1E4] text-gray-700 rounded text-xs"
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
                    <Button className="bg-[#83835B] hover:bg-[#60603b] text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClinics.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No testing centers found in {selectedCity}. Try selecting a different city.
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-4xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-[#C9C8B2] rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F1F1E4] transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="text-lg pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#83835B] flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
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
        <div className="bg-gradient-to-r from-[#83835B] to-[#60603b] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Understand Your Fertility?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get comprehensive fertility testing to make informed decisions about your reproductive health
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-[#83835B] hover:bg-white/90"
              onClick={onSearchClinics}
            >
              Find Testing Centers
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