import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EmbryoFreezingQuizProps {
  onClose: () => void;
}

interface QuizAnswers {
  age: string;
  partnerAge: string;
  hasAMH: string;
  amhLevel: string;
  fertilityConditions: string[];
  embryoReason: string;
  timing: string;
  priorities: {
    price: number;
    successRates: number;
    doctorReputation: number;
    comfort: number;
    location: number;
    fastStart: number;
  };
  travelPreference: string;
  storagePreference: string;
}

export function EmbryoFreezingQuiz({ onClose }: EmbryoFreezingQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    age: '',
    partnerAge: '',
    hasAMH: '',
    amhLevel: '',
    fertilityConditions: [],
    embryoReason: '',
    timing: '',
    priorities: {
      price: 3,
      successRates: 3,
      doctorReputation: 3,
      comfort: 3,
      location: 3,
      fastStart: 3
    },
    travelPreference: '',
    storagePreference: ''
  });

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleFertilityCondition = (condition: string) => {
    const currentConditions = answers.fertilityConditions;
    if (currentConditions.includes(condition)) {
      setAnswers({
        ...answers,
        fertilityConditions: currentConditions.filter(c => c !== condition)
      });
    } else {
      setAnswers({
        ...answers,
        fertilityConditions: [...currentConditions, condition]
      });
    }
  };

  const calculateResults = () => {
    let expectedEmbryos = '';
    let recommendedEmbryos = 0;
    
    // Calculate based on age and AMH
    if (parseInt(answers.age.split('-')[0]) < 35) {
      expectedEmbryos = '8-12 embryos';
      recommendedEmbryos = 10;
    } else if (parseInt(answers.age.split('-')[0]) < 38) {
      expectedEmbryos = '6-10 embryos';
      recommendedEmbryos = 8;
    } else {
      expectedEmbryos = '4-8 embryos';
      recommendedEmbryos = 6;
    }

    if (answers.amhLevel === 'low') {
      recommendedEmbryos -= 2;
    } else if (answers.amhLevel === 'high') {
      recommendedEmbryos += 2;
    }

    // Calculate costs
    let totalCostLow = 12000;
    let totalCostHigh = 18000;
    
    if (answers.travelPreference === 'uk-europe') {
      totalCostLow = 8000;
      totalCostHigh = 12000;
    } else if (answers.travelPreference === 'willing-travel') {
      totalCostLow = 6000;
      totalCostHigh = 10000;
    }

    return {
      expectedEmbryos,
      recommendedEmbryos,
      costRange: `$${totalCostLow.toLocaleString()} - $${totalCostHigh.toLocaleString()}`,
      timeline: '2-3 weeks for full cycle'
    };
  };

  const getRecommendedClinics = () => {
    const clinics = [
      { name: 'Boston IVF', successRate: 87, price: '$12,000-$16,000', location: 'Boston, USA' },
      { name: 'Pacific Fertility - San Francisco', successRate: 85, price: '$14,000-$18,000', location: 'San Francisco, USA' },
      { name: 'Reproductive Health Center - New York', successRate: 84, price: '$13,000-$17,000', location: 'New York, USA' },
      { name: 'Memorial Bahçelievler IVF - Istanbul', successRate: 82, price: '$6,000-$9,000', location: 'Istanbul, Turkey' },
      { name: 'Barcelona IVF', successRate: 83, price: '$8,000-$11,000', location: 'Barcelona, Spain' }
    ];

    if (answers.travelPreference === 'local-only') {
      return clinics.filter(c => c.location.includes('USA')).slice(0, 3);
    } else if (answers.travelPreference === 'uk-europe') {
      return clinics.filter(c => c.location.includes('Turkey') || c.location.includes('Spain')).slice(0, 3);
    }

    const sortedClinics = [...clinics];
    if (answers.priorities.price > 4) {
      sortedClinics.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
    } else if (answers.priorities.successRates > 4) {
      sortedClinics.sort((a, b) => b.successRate - a.successRate);
    }

    return sortedClinics.slice(0, 3);
  };

  if (showResults) {
    const results = calculateResults();
    const recommendedClinics = getRecommendedClinics();

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl">Your Personalized Results</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Expected Outcomes */}
            <div className="bg-[#EEF2FE] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl">Expected Outcomes</h3>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="text-[#5B6AA5] hover:text-[#464a00] transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showTooltip && (
                    <div className="absolute left-0 top-8 z-10 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                      <p className="text-sm text-gray-700">
                        These expected outcomes are based on the data you shared and the statistics currently available to Journey Fertility. Expected outcomes only give you an idea, but the actual results might differ.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Expected Embryos</p>
                  <p className="text-2xl">{results.expectedEmbryos}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Recommended for Storage</p>
                  <p className="text-2xl">{results.recommendedEmbryos} embryos</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Expected Cost Range</p>
                  <p className="text-2xl">{results.costRange}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Timeline</p>
                  <p className="text-2xl">{results.timeline}</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-xl mb-4">Cost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Initial Consultation & Tests</span>
                  <span>$800-$1,500</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Stimulation Medications</span>
                  <span>$3,000-$5,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Egg Retrieval & Fertilization</span>
                  <span>$5,000-$8,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Embryo Culture & Development</span>
                  <span>$2,000-$3,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Genetic Testing (Optional)</span>
                  <span>$2,000-$5,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>First Year Storage</span>
                  <span>$500-$1,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Additional Storage (per year)</span>
                  <span>$500-$800</span>
                </div>
              </div>
            </div>

            {/* Recommended Clinics */}
            <div>
              <h3 className="text-xl mb-4">Recommended Clinics for You</h3>
              <div className="space-y-4">
                {recommendedClinics.map((clinic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{clinic.name}</h4>
                        <p className="text-sm text-gray-600">{clinic.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-[#E7EDFD] text-[#5B6AA5] px-2 py-1 rounded text-sm">
                          {clinic.successRate}% success rate
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{clinic.price}</span>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#A8BEEB] to-[#6B7FC7] rounded-lg p-6 text-white text-center">
              <h3 className="text-xl mb-2">Ready to take the next step?</h3>
              <p className="mb-4">Get a personalized quote from these clinics based on your assessment</p>
              <Button variant="secondary" className="bg-white text-[#5B6AA5] hover:bg-gray-100">
                Get Personalized Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl">EMBRYO FREEZING - Self-Assessment Quiz</h2>
            <p className="text-gray-600 text-sm mt-1">
              Help us understand your needs to provide personalized recommendations
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Question {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#A8BEEB] to-[#6B7FC7] transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6">
          {/* Question 1: Age */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl">How old are you?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'under-30', label: 'Under 30' },
                  { value: '30-34', label: '30-34' },
                  { value: '35-37', label: '35-37' },
                  { value: '38-40', label: '38-40' },
                  { value: '41-43', label: '41-43' },
                  { value: '44+', label: '44+' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, age: option.value })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      answers.age === option.value
                        ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Partner Age */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl">How old is your partner?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'under-30', label: 'Under 30' },
                  { value: '30-34', label: '30-34' },
                  { value: '35-39', label: '35-39' },
                  { value: '40-44', label: '40-44' },
                  { value: '45+', label: '45+' },
                  { value: 'using-donor', label: 'Using donor sperm' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, partnerAge: option.value })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      answers.partnerAge === option.value
                        ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Embryo Reason */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl">Why are you considering embryo freezing?</h3>
              <div className="space-y-3">
                {[
                  { value: 'ivf-cycle', label: 'As part of an IVF cycle' },
                  { value: 'future-planning', label: 'For future family planning' },
                  { value: 'medical-treatment', label: 'Before medical treatment (cancer, etc.)' },
                  { value: 'genetic-testing', label: 'For genetic testing before transfer' },
                  { value: 'preserve-fertility', label: 'To preserve fertility as a couple' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, embryoReason: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.embryoReason === option.value
                        ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 4: AMH Test */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl">Have you had an AMH test?</h3>
              <div className="space-y-3">
                {[
                  { value: 'yes-know', label: 'Yes, I know my number' },
                  { value: 'yes-forgot', label: "Yes, but I don't remember the result" },
                  { value: 'no', label: 'No, not yet' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, hasAMH: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.hasAMH === option.value
                        ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {answers.hasAMH === 'yes-know' && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-600">Select your AMH level:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Low (<1.0)' },
                      { value: 'medium', label: 'Medium (1.0-3.0)' },
                      { value: 'high', label: 'High (>3.0)' }
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setAnswers({ ...answers, amhLevel: level.value })}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          answers.amhLevel === level.value
                            ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: level.label }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question 5: Timing */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl">When are you planning to freeze embryos?</h3>
              <div className="space-y-3">
                {[
                  { value: 'within-1-month', label: 'Within 1 month' },
                  { value: '2-3-months', label: 'In 2-3 months' },
                  { value: 'later-this-year', label: 'Later this year' },
                  { value: 'exploring', label: 'Just exploring options' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, timing: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.timing === option.value
                        ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 6: Travel Preference */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl">Are you open to travelling for treatment?</h3>
              <div className="space-y-3">
                {[
                  { value: 'local-only', label: 'Only local' },
                  { value: 'uk-europe', label: 'UK & Europe' },
                  { value: 'willing-travel', label: 'Willing to travel if quality & price are better' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, travelPreference: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.travelPreference === option.value
                        ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 7: Storage Preference */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-xl">How long do you plan to store your embryos?</h3>
              <div className="space-y-3">
                {[
                  { value: '1-2-years', label: '1-2 years' },
                  { value: '3-5-years', label: '3-5 years' },
                  { value: '5-10-years', label: '5-10 years' },
                  { value: 'long-term', label: 'Long-term (10+ years)' },
                  { value: 'not-sure', label: 'Not sure yet' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, storagePreference: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.storagePreference === option.value
                        ? 'border-[#F8AD7C] bg-[#FDEEE1]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext} className={currentStep === totalSteps ? '' : 'bg-[#2F3440] text-white hover:bg-[#434A5C]'}
            className="bg-gradient-to-r from-[#A8BEEB] to-[#6B7FC7] hover:opacity-90 flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'See Results' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
