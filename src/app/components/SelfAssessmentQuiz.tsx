import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SelfAssessmentQuizProps {
  onClose: () => void;
}

interface QuizAnswers {
  age: string;
  hasAMH: string;
  amhLevel: string;
  amhValue?: string;
  amhDate?: string;
  fertilityConditions: string[];
  primaryGoal: string;
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
  stimulationProtocol: string;
}

export function SelfAssessmentQuiz({ onClose }: SelfAssessmentQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    age: '',
    hasAMH: '',
    amhLevel: '',
    amhValue: '',
    amhDate: '',
    fertilityConditions: [],
    primaryGoal: '',
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
    stimulationProtocol: ''
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

  const handlePriorityChange = (priority: keyof QuizAnswers['priorities'], value: number) => {
    setAnswers({
      ...answers,
      priorities: {
        ...answers.priorities,
        [priority]: value
      }
    });
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
    // Calculate expected egg yield based on age
    let eggYieldRange = '';
    let recommendedCycles = 1;
    
    switch (answers.age) {
      case 'under-30':
        eggYieldRange = '15-25 eggs';
        recommendedCycles = 1;
        break;
      case '30-34':
        eggYieldRange = '12-20 eggs';
        recommendedCycles = 1;
        break;
      case '35-37':
        eggYieldRange = '8-15 eggs';
        recommendedCycles = 2;
        break;
      case '38-40':
        eggYieldRange = '6-12 eggs';
        recommendedCycles = 2;
        break;
      case '41-43':
        eggYieldRange = '4-8 eggs';
        recommendedCycles = 3;
        break;
      case '44+':
        eggYieldRange = '2-5 eggs';
        recommendedCycles = 3;
        break;
    }

    // Adjust based on AMH level
    if (answers.amhLevel === 'low') {
      recommendedCycles += 1;
    } else if (answers.amhLevel === 'high') {
      recommendedCycles = Math.max(1, recommendedCycles - 1);
    }

    // Calculate cost range based on cycles and travel preference
    let costPerCycle = 8000;
    if (answers.travelPreference === 'uk-europe') {
      costPerCycle = 5000;
    } else if (answers.travelPreference === 'willing-travel') {
      costPerCycle = 4000;
    }

    const totalCostLow = costPerCycle * recommendedCycles;
    const totalCostHigh = (costPerCycle + 3000) * recommendedCycles;

    return {
      eggYieldRange,
      recommendedCycles,
      costRange: `$${totalCostLow.toLocaleString()} - $${totalCostHigh.toLocaleString()}`,
      timeline: '10-12 days per cycle'
    };
  };

  const getRecommendedClinics = () => {
    const clinics = [
      { name: 'Reproductive Health Center - New York', successRate: 85, price: '$8,000-$12,000', location: 'New York, USA' },
      { name: 'Boston IVF', successRate: 82, price: '$9,000-$13,000', location: 'Boston, USA' },
      { name: 'Pacific Fertility - San Francisco', successRate: 84, price: '$10,000-$14,000', location: 'San Francisco, USA' },
      { name: 'Memorial Bahçelievler IVF - Istanbul', successRate: 80, price: '$3,500-$5,000', location: 'Istanbul, Turkey' },
      { name: 'Jinemed Hospital - Istanbul', successRate: 78, price: '$3,000-$4,500', location: 'Istanbul, Turkey' }
    ];

    // Filter based on travel preference
    if (answers.travelPreference === 'local-only') {
      return clinics.filter(c => c.location.includes('USA')).slice(0, 3);
    } else if (answers.travelPreference === 'uk-europe') {
      return clinics.filter(c => c.location.includes('Turkey')).slice(0, 3);
    }

    // Sort by priorities
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
                  <p className="text-gray-600 text-sm mb-1">Expected Egg Yield</p>
                  <p className="text-2xl">{results.eggYieldRange}</p>
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
                  <span>$500-$1,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Stimulation Medications</span>
                  <span>$2,000-$4,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Egg Retrieval Procedure</span>
                  <span>$4,000-$6,000</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Anesthesia</span>
                  <span>$500-$1,000</span>
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

            {/* Timeline Visual */}
            <div>
              <h3 className="text-xl mb-4">Treatment Timeline</h3>
              <div className="bg-[#F1F1E4] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">1</div>
                    <p className="text-xs">Initial Consult</p>
                    <p className="text-xs text-gray-500">Day 1</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">2</div>
                    <p className="text-xs">Start Medications</p>
                    <p className="text-xs text-gray-500">Day 2-3</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">3</div>
                    <p className="text-xs">Monitoring</p>
                    <p className="text-xs text-gray-500">Day 4-9</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 bg-[#313131] rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">4</div>
                    <p className="text-xs">Egg Retrieval</p>
                    <p className="text-xs text-gray-500">Day 10-12</p>
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
            <h2 className="text-2xl">EGG FREEZING - Self-Assessment Quiz</h2>
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

          {/* Question 2: AMH Test */}
          {currentStep === 2 && (
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
                        ? 'border-[#f7f775] bg-[#FBFCE8]'
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
                            ? 'border-[#f7f775] bg-[#FBFCE8]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm">{level.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="text-sm text-gray-600 block mb-2">Or enter exact value (optional):</label>
                    <Input
                      type="text"
                      placeholder="e.g., 2.5 ng/mL or 18 pmol/L"
                      value={answers.amhValue || ''}
                      onChange={(e) => setAnswers({ ...answers, amhValue: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="text-sm text-gray-600 block mb-2">When did you take the test?</label>
                    <Input
                      type="date"
                      value={answers.amhDate || ''}
                      onChange={(e) => setAnswers({ ...answers, amhDate: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question 3: Primary Goal */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl">What is your primary goal?</h3>
              <div className="space-y-3">
                {[
                  { value: 'future-options', label: "Freeze eggs for 'future options'" },
                  { value: 'not-ready', label: "I'm not ready to have a child yet but want fertility insurance" },
                  { value: 'planning', label: 'Planning pregnancy in 1-3 years' },
                  { value: 'diagnosed', label: 'Diagnosed risk of diminished fertility / family history of early menopause' },
                  { value: 'medical', label: 'Medical reason (e.g., endometriosis, cancer treatment)' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, primaryGoal: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.primaryGoal === option.value
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

          {/* Question 4: Timing */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl">How soon are you thinking of freezing?</h3>
              <div className="space-y-3">
                {[
                  { value: 'within-1-month', label: 'Within 1 month' },
                  { value: '2-3-months', label: 'In 2-3 months' },
                  { value: 'later-this-year', label: 'Later this year' },
                  { value: 'exploring', label: 'Just exploring' }
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

          {/* Question 5: Travel Preference */}
          {currentStep === 5 && (
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

          {/* Question 6: Stimulation Protocol */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl">Do you prefer a mild or standard stimulation protocol?</h3>
              <p className="text-sm text-gray-600">Optional - we can recommend one for you</p>
              <div className="space-y-3">
                {[
                  { value: 'mild', label: 'I prefer mild (lower meds, calmer cycle)' },
                  { value: 'standard', label: 'I prefer standard (higher egg yield)' },
                  { value: 'recommend', label: 'Not sure - recommend for me' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, stimulationProtocol: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.stimulationProtocol === option.value
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

          {/* Question 7: Fertility Conditions */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-xl">Do any of these conditions affect either of your fertility?</h3>
              <p className="text-sm text-gray-600">Select all that apply. Male factor can include low sperm count, low sperm morphology and azoospermia</p>
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
                  { value: 'other', label: 'Other' },
                  { value: 'none', label: 'None' },
                  { value: 'dont-know', label: "Don't know" }
                ].map((option) => {
                  const isSelected = answers.fertilityConditions.includes(option.value);
                  const isNoneOrDontKnow = option.value === 'none' || option.value === 'dont-know';
                  const hasOtherSelections = answers.fertilityConditions.some(c => c !== 'none' && c !== 'dont-know');
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        // If selecting "None" or "Don't know", clear all other selections
                        if (isNoneOrDontKnow && !isSelected) {
                          setAnswers({ ...answers, fertilityConditions: [option.value] });
                        }
                        // If selecting a condition while "None" or "Don't know" is selected, replace it
                        else if (!isNoneOrDontKnow && (answers.fertilityConditions.includes('none') || answers.fertilityConditions.includes('dont-know'))) {
                          setAnswers({ ...answers, fertilityConditions: [option.value] });
                        }
                        // Otherwise toggle normally
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
              {answers.fertilityConditions.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {answers.fertilityConditions.length} condition{answers.fertilityConditions.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Question 8: Final Review */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-xl">Review your answers</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{answers.age.replace('-', ' to ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AMH Status:</span>
                  <span className="font-medium">
                    {answers.hasAMH === 'yes-know' 
                      ? `Yes (${answers.amhLevel})${answers.amhDate ? ` - ${new Date(answers.amhDate).toLocaleDateString()}` : ''}`
                      : answers.hasAMH === 'yes-forgot' 
                      ? 'Yes, forgot result' 
                      : 'Not tested'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary Goal:</span>
                  <span className="font-medium">{answers.primaryGoal.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timing:</span>
                  <span className="font-medium">{answers.timing.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Preference:</span>
                  <span className="font-medium">{answers.travelPreference.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protocol Preference:</span>
                  <span className="font-medium">{answers.stimulationProtocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fertility Conditions:</span>
                  <span className="font-medium">{answers.fertilityConditions.length > 0 ? answers.fertilityConditions.length : 'None'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">
                Click "Finish" to see your personalized results and recommendations
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext} className={currentStep === totalSteps ? '' : 'bg-[#313131] text-white hover:bg-[#454545]'}
            disabled={
              (currentStep === 1 && !answers.age) ||
              (currentStep === 2 && !answers.hasAMH) ||
              (currentStep === 2 && answers.hasAMH === 'yes-know' && !answers.amhLevel) ||
              (currentStep === 3 && !answers.primaryGoal) ||
              (currentStep === 4 && !answers.timing) ||
              (currentStep === 5 && !answers.travelPreference) ||
              (currentStep === 6 && !answers.stimulationProtocol)
            }
          >
            {currentStep === totalSteps ? 'Finish' : 'Next'}
            {currentStep !== totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}