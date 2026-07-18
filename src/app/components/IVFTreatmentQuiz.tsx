import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from './ui/button';

interface IVFTreatmentQuizProps {
  onClose: () => void;
}

interface QuizAnswers {
  age: string;
  partnerAge: string;
  tryingDuration: string;
  fertilityConditions: string[];
  previousIVF: string;
  ivfCycles: string;
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
  pgtTesting: string;
}

export function IVFTreatmentQuiz({ onClose }: IVFTreatmentQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    age: '',
    partnerAge: '',
    tryingDuration: '',
    fertilityConditions: [],
    previousIVF: '',
    ivfCycles: '',
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
    pgtTesting: ''
  });

  const totalSteps = 8;

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
    let successRate = 0;
    let recommendedCycles = 1;
    
    // Calculate based on age
    const ageNum = parseInt(answers.age.split('-')[0]);
    if (ageNum < 30) {
      successRate = 55;
      recommendedCycles = 1;
    } else if (ageNum < 35) {
      successRate = 45;
      recommendedCycles = 1;
    } else if (ageNum < 38) {
      successRate = 35;
      recommendedCycles = 2;
    } else if (ageNum < 41) {
      successRate = 25;
      recommendedCycles = 2;
    } else {
      successRate = 15;
      recommendedCycles = 3;
    }

    // Adjust based on previous IVF
    if (answers.previousIVF === 'yes') {
      successRate -= 5;
      recommendedCycles += 1;
    }

    // Calculate costs
    let costPerCycle = 15000;
    if (answers.travelPreference === 'uk-europe') {
      costPerCycle = 9000;
    } else if (answers.travelPreference === 'willing-travel') {
      costPerCycle = 7000;
    }

    // Add PGT testing cost if selected
    if (answers.pgtTesting === 'yes') {
      costPerCycle += 3000;
    }

    const totalCostLow = costPerCycle * recommendedCycles;
    const totalCostHigh = (costPerCycle + 5000) * recommendedCycles;

    return {
      successRate: `${successRate}%`,
      recommendedCycles,
      costRange: `$${totalCostLow.toLocaleString()} - $${totalCostHigh.toLocaleString()}`,
      timeline: '4-6 weeks per cycle'
    };
  };

  const getRecommendedClinics = () => {
    const clinics = [
      { name: 'Boston IVF', successRate: 62, price: '$15,000-$20,000', location: 'Boston, USA' },
      { name: 'Pacific Fertility - San Francisco', successRate: 60, price: '$18,000-$23,000', location: 'San Francisco, USA' },
      { name: 'Reproductive Health Center - New York', successRate: 58, price: '$16,000-$21,000', location: 'New York, USA' },
      { name: 'Memorial Bahçelievler IVF - Istanbul', successRate: 57, price: '$7,000-$10,000', location: 'Istanbul, Turkey' },
      { name: 'Barcelona IVF', successRate: 59, price: '$9,000-$13,000', location: 'Barcelona, Spain' }
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
            <div className="bg-[#F1F1E4] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl">Expected Outcomes</h3>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="text-[#5e6300] hover:text-[#464a00] transition-colors"
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
                  <p className="text-gray-600 text-sm mb-1">Success Rate Per Cycle</p>
                  <p className="text-2xl">{results.successRate}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Recommended Cycles</p>
                  <p className="text-2xl">{results.recommendedCycles} cycle{results.recommendedCycles > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Expected Cost Range</p>
                  <p className="text-2xl">{results.costRange}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Timeline Per Cycle</p>
                  <p className="text-2xl">{results.timeline}</p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-xl mb-4">Cost Breakdown (per cycle)</h3>
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
                  <span>Egg Retrieval</span>
                  <span>$5,000-$7,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Fertilization & Culture</span>
                  <span>$2,000-$3,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Embryo Transfer</span>
                  <span>$2,000-$3,000</span>
                </div>
                {answers.pgtTesting === 'yes' && (
                  <div className="flex justify-between py-2 border-b">
                    <span>PGT Genetic Testing</span>
                    <span>$3,000-$5,000</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span>Anesthesia & Facility Fees</span>
                  <span>$1,000-$2,000</span>
                </div>
              </div>
            </div>

            {/* Timeline Visual */}
            <div>
              <h3 className="text-xl mb-4">Treatment Timeline</h3>
              <div className="bg-[#F1F1E4] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">1</div>
                    <p className="text-xs">Testing & Planning</p>
                    <p className="text-xs text-gray-500">Week 1</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">2</div>
                    <p className="text-xs">Ovarian Stimulation</p>
                    <p className="text-xs text-gray-500">Week 2-3</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">3</div>
                    <p className="text-xs">Egg Retrieval</p>
                    <p className="text-xs text-gray-500">Week 3-4</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">4</div>
                    <p className="text-xs">Embryo Transfer</p>
                    <p className="text-xs text-gray-500">Week 4-6</p>
                  </div>
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
                        <div className="bg-[#EDECD4] text-[#5e6300] px-2 py-1 rounded text-sm">
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
            <div className="bg-gradient-to-r from-[#83835B] to-[#60603b] rounded-lg p-6 text-white text-center">
              <h3 className="text-xl mb-2">Ready to take the next step?</h3>
              <p className="mb-4">Get a personalized quote from these clinics based on your assessment</p>
              <Button variant="secondary" className="bg-white text-[#5e6300] hover:bg-gray-100">
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
            <h2 className="text-2xl">IVF TREATMENT - Self-Assessment Quiz</h2>
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
              className="h-full bg-gradient-to-r from-[#83835B] to-[#60603b] transition-all duration-300"
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
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
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
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Trying Duration */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl">How long have you been trying to conceive?</h3>
              <div className="space-y-3">
                {[
                  { value: 'less-6-months', label: 'Less than 6 months' },
                  { value: '6-12-months', label: '6-12 months' },
                  { value: '1-2-years', label: '1-2 years' },
                  { value: '2-3-years', label: '2-3 years' },
                  { value: 'over-3-years', label: 'Over 3 years' },
                  { value: 'not-trying', label: 'Not trying yet - exploring options' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, tryingDuration: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.tryingDuration === option.value
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 4: Previous IVF */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl">Have you tried IVF before?</h3>
              <div className="space-y-3">
                {[
                  { value: 'no', label: 'No, this would be my first time' },
                  { value: 'yes', label: 'Yes, I have tried before' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, previousIVF: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.previousIVF === option.value
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {answers.previousIVF === 'yes' && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-600">How many cycles have you completed?</p>
                  <div className="grid grid-cols-4 gap-3">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setAnswers({ ...answers, ivfCycles: num })}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          answers.ivfCycles === num
                            ? 'border-[#f7f775] bg-[#FBFCE8]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question 5: Fertility Conditions */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl">Do any of these conditions apply to you?</h3>
              <p className="text-sm text-gray-600">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {[
                  { value: 'tubal-factor', label: 'Tubal factor' },
                  { value: 'endometriosis', label: 'Endometriosis' },
                  { value: 'ovulatory-factor', label: 'Ovulatory factor' },
                  { value: 'diminished-ovarian-reserve', label: 'Diminished ovarian reserve' },
                  { value: 'uterine-factor', label: 'Uterine factor' },
                  { value: 'pcos', label: 'PCOS' },
                  { value: 'male-factor', label: 'Male factor' },
                  { value: 'unexplained', label: 'Unexplained infertility' },
                  { value: 'recurrent-miscarriage', label: 'Recurrent miscarriage' },
                  { value: 'other', label: 'Other' },
                  { value: 'none', label: 'None' },
                  { value: 'dont-know', label: "Don't know" }
                ].map((option) => {
                  const isSelected = answers.fertilityConditions.includes(option.value);
                  const isNoneOrDontKnow = option.value === 'none' || option.value === 'dont-know';
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (isNoneOrDontKnow && !isSelected) {
                          setAnswers({ ...answers, fertilityConditions: [option.value] });
                        }
                        else if (!isNoneOrDontKnow && (answers.fertilityConditions.includes('none') || answers.fertilityConditions.includes('dont-know'))) {
                          setAnswers({ ...answers, fertilityConditions: [option.value] });
                        }
                        else {
                          toggleFertilityCondition(option.value);
                        }
                      }}
                      className={`p-3 border-2 rounded-lg text-left text-sm transition-all ${
                        isSelected
                          ? 'border-[#f7f775] bg-[#FBFCE8]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 6: PGT Testing */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl">Are you interested in PGT genetic testing?</h3>
              <p className="text-sm text-gray-600">PGT can screen embryos for genetic abnormalities before transfer</p>
              <div className="space-y-3">
                {[
                  { value: 'yes', label: 'Yes, I want PGT testing' },
                  { value: 'maybe', label: 'Maybe - need more information' },
                  { value: 'no', label: 'No, not interested' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, pgtTesting: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.pgtTesting === option.value
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 7: Timing */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-xl">When do you want to start IVF treatment?</h3>
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
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 8: Travel Preference */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-xl">Are you open to travelling for treatment?</h3>
              <p className="text-sm text-gray-600">International treatment can offer significant cost savings</p>
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
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
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
            onClick={handleNext} className={currentStep === totalSteps ? '' : 'bg-[#313131] text-white hover:bg-[#454545]'}
            className="bg-gradient-to-r from-[#83835B] to-[#60603b] hover:opacity-90 flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'See Results' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
