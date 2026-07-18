import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from './ui/button';

interface FertilityTestingQuizProps {
  onClose: () => void;
}

interface QuizAnswers {
  age: string;
  relationshipStatus: string;
  tryingDuration: string;
  menstrualCycle: string;
  symptoms: string[];
  previousTests: string;
  testingGoal: string;
  travelPreference: string;
}

export function FertilityTestingQuiz({ onClose }: FertilityTestingQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    age: '',
    relationshipStatus: '',
    tryingDuration: '',
    menstrualCycle: '',
    symptoms: [],
    previousTests: '',
    testingGoal: '',
    travelPreference: ''
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

  const toggleSymptom = (symptom: string) => {
    const currentSymptoms = answers.symptoms;
    if (currentSymptoms.includes(symptom)) {
      setAnswers({
        ...answers,
        symptoms: currentSymptoms.filter(s => s !== symptom)
      });
    } else {
      setAnswers({
        ...answers,
        symptoms: [...currentSymptoms, symptom]
      });
    }
  };

  const calculateResults = () => {
    const recommendedTests = [];
    
    // Basic tests for everyone
    recommendedTests.push('AMH (Anti-Müllerian Hormone) Test');
    recommendedTests.push('FSH (Follicle-Stimulating Hormone) Test');
    recommendedTests.push('Antral Follicle Count Ultrasound');
    
    // Age-based recommendations
    if (parseInt(answers.age.split('-')[0]) >= 35) {
      recommendedTests.push('Comprehensive Hormone Panel');
    }
    
    // Symptom-based recommendations
    if (answers.symptoms.includes('irregular-periods') || answers.symptoms.includes('heavy-periods')) {
      recommendedTests.push('Thyroid Function Tests');
      recommendedTests.push('Prolactin Test');
    }
    
    if (answers.symptoms.includes('pelvic-pain')) {
      recommendedTests.push('Pelvic Ultrasound');
    }
    
    if (answers.relationshipStatus === 'partner' || answers.relationshipStatus === 'married') {
      recommendedTests.push('Partner Semen Analysis');
    }

    // Calculate costs
    let totalCostLow = 500;
    let totalCostHigh = 1200;
    
    if (answers.travelPreference === 'uk-europe') {
      totalCostLow = 300;
      totalCostHigh = 800;
    } else if (answers.travelPreference === 'willing-travel') {
      totalCostLow = 200;
      totalCostHigh = 600;
    }

    return {
      recommendedTests,
      costRange: `$${totalCostLow.toLocaleString()} - $${totalCostHigh.toLocaleString()}`,
      timeline: '1-2 weeks for results'
    };
  };

  const getRecommendedClinics = () => {
    const clinics = [
      { name: 'Reproductive Health Center - New York', price: '$800-$1,200', location: 'New York, USA', rating: 4.8 },
      { name: 'Boston IVF Testing Center', price: '$700-$1,000', location: 'Boston, USA', rating: 4.7 },
      { name: 'Pacific Fertility Lab - San Francisco', price: '$900-$1,300', location: 'San Francisco, USA', rating: 4.9 },
      { name: 'Memorial Hospital Testing - Istanbul', price: '$250-$500', location: 'Istanbul, Turkey', rating: 4.6 },
      { name: 'Barcelona Fertility Clinic', price: '$350-$700', location: 'Barcelona, Spain', rating: 4.7 }
    ];

    if (answers.travelPreference === 'local-only') {
      return clinics.filter(c => c.location.includes('USA')).slice(0, 3);
    } else if (answers.travelPreference === 'uk-europe') {
      return clinics.filter(c => c.location.includes('Turkey') || c.location.includes('Spain')).slice(0, 3);
    }

    const sortedClinics = [...clinics];
    sortedClinics.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));

    return sortedClinics.slice(0, 3);
  };

  if (showResults) {
    const results = calculateResults();
    const recommendedClinics = getRecommendedClinics();

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl">Your Personalized Testing Plan</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Recommended Tests */}
            <div className="bg-[#F1F1E4] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl">Recommended Tests</h3>
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
                        These test recommendations are based on the data you shared. Your healthcare provider may recommend additional or different tests based on your specific situation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {results.recommendedTests.map((test, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="w-6 h-6 bg-[#313131] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{test}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-300">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Expected Cost Range</p>
                  <p className="text-2xl">{results.costRange}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Timeline for Results</p>
                  <p className="text-2xl">{results.timeline}</p>
                </div>
              </div>
            </div>

            {/* What Each Test Shows */}
            <div>
              <h3 className="text-xl mb-4">What These Tests Tell You</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">AMH (Anti-Müllerian Hormone)</h4>
                  <p className="text-sm text-gray-600">Indicates your ovarian reserve - how many eggs you have remaining</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">FSH (Follicle-Stimulating Hormone)</h4>
                  <p className="text-sm text-gray-600">Measures egg quality and ovarian function</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Antral Follicle Count</h4>
                  <p className="text-sm text-gray-600">Ultrasound count of resting follicles to assess ovarian reserve</p>
                </div>
                {results.recommendedTests.includes('Thyroid Function Tests') && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Thyroid Function</h4>
                    <p className="text-sm text-gray-600">Checks if thyroid issues may be affecting your cycle and fertility</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Testing Centers */}
            <div>
              <h3 className="text-xl mb-4">Recommended Testing Centers</h3>
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
                          {clinic.rating} ★ rating
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

            {/* At-Home Test Kits */}
            <div>
              <h3 className="text-xl mb-4">At-Home Test Kit Options</h3>
              <p className="text-sm text-gray-600 mb-4">
                Convenient testing from the comfort of your home. Results typically available in 5-7 days.
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Modern Fertility Hormone Test</h4>
                      <p className="text-sm text-gray-600">Tests AMH, FSH, TSH, and 6 other hormones</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-[#EDECD4] text-[#5e6300] px-2 py-1 rounded text-sm">
                        Popular choice
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">$159</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Everlywell Women's Fertility Test</h4>
                      <p className="text-sm text-gray-600">AMH, TSH, fT4, and other key markers</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-[#EDECD4] text-[#5e6300] px-2 py-1 rounded text-sm">
                        HSA/FSA eligible
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">$149</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">LetsGetChecked Ovarian Reserve Test</h4>
                      <p className="text-sm text-gray-600">AMH testing with nurse support included</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">$139</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">myLAB Box At Home Fertility Test</h4>
                      <p className="text-sm text-gray-600">Comprehensive panel including AMH, FSH, LH</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">$179</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-[#F1F1E4] rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> At-home tests are great for initial insights, but we recommend following up with a fertility specialist to discuss your results and next steps.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-[#F1F1E4] rounded-lg p-6">
              <h3 className="text-xl mb-4">Next Steps</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="font-medium">1.</span>
                  <span>Schedule testing on Day 2-4 of your menstrual cycle for most accurate hormone results</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium">2.</span>
                  <span>Bring test results to a fertility specialist consultation to discuss your options</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium">3.</span>
                  <span>Ask about insurance coverage or payment plans to make testing more affordable</span>
                </li>
              </ol>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#83835B] to-[#60603b] rounded-lg p-6 text-white text-center">
              <h3 className="text-xl mb-2">Ready to get tested?</h3>
              <p className="mb-4">Book your fertility testing appointment at one of our recommended centers</p>
              <Button variant="secondary" className="bg-white text-[#5e6300] hover:bg-gray-100">
                Book Testing Appointment
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
            <h2 className="text-2xl">FERTILITY TESTING - Self-Assessment Quiz</h2>
            <p className="text-gray-600 text-sm mt-1">
              Help us understand your needs to recommend the right tests
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
                  { value: 'under-25', label: 'Under 25' },
                  { value: '25-29', label: '25-29' },
                  { value: '30-34', label: '30-34' },
                  { value: '35-37', label: '35-37' },
                  { value: '38-40', label: '38-40' },
                  { value: '41+', label: '41+' }
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

          {/* Question 2: Relationship Status */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl">What is your relationship status?</h3>
              <div className="space-y-3">
                {[
                  { value: 'single', label: 'Single' },
                  { value: 'partner', label: 'In a relationship' },
                  { value: 'married', label: 'Married' },
                  { value: 'prefer-not-say', label: 'Prefer not to say' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, relationshipStatus: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.relationshipStatus === option.value
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
              <h3 className="text-xl">Are you currently trying to conceive?</h3>
              <div className="space-y-3">
                {[
                  { value: 'not-trying', label: 'Not trying - just curious about my fertility' },
                  { value: 'planning', label: 'Planning to try in the future' },
                  { value: 'less-6-months', label: 'Trying for less than 6 months' },
                  { value: '6-12-months', label: 'Trying for 6-12 months' },
                  { value: 'over-1-year', label: 'Trying for over 1 year' }
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

          {/* Question 4: Menstrual Cycle */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl">How would you describe your menstrual cycle?</h3>
              <div className="space-y-3">
                {[
                  { value: 'regular', label: 'Regular (every 25-35 days)' },
                  { value: 'irregular', label: 'Irregular (varies each month)' },
                  { value: 'absent', label: 'Absent or very infrequent' },
                  { value: 'not-sure', label: 'Not sure' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, menstrualCycle: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.menstrualCycle === option.value
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

          {/* Question 5: Symptoms */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl">Do you experience any of these symptoms?</h3>
              <p className="text-sm text-gray-600">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'irregular-periods', label: 'Irregular periods' },
                  { value: 'heavy-periods', label: 'Heavy or painful periods' },
                  { value: 'pelvic-pain', label: 'Pelvic pain' },
                  { value: 'painful-sex', label: 'Painful intercourse' },
                  { value: 'acne-hair', label: 'Acne or excess hair growth' },
                  { value: 'weight-changes', label: 'Unexplained weight changes' },
                  { value: 'hot-flashes', label: 'Hot flashes or night sweats' },
                  { value: 'none', label: 'None of these' }
                ].map((option) => {
                  const isSelected = answers.symptoms.includes(option.value);
                  const isNone = option.value === 'none';
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (isNone && !isSelected) {
                          setAnswers({ ...answers, symptoms: ['none'] });
                        } else if (!isNone && answers.symptoms.includes('none')) {
                          setAnswers({ ...answers, symptoms: [option.value] });
                        } else {
                          toggleSymptom(option.value);
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

          {/* Question 6: Previous Tests */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl">Have you had fertility testing before?</h3>
              <div className="space-y-3">
                {[
                  { value: 'no', label: 'No, this would be my first time' },
                  { value: 'some', label: 'Yes, some basic tests' },
                  { value: 'comprehensive', label: 'Yes, comprehensive testing' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, previousTests: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.previousTests === option.value
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

          {/* Question 7: Testing Goal */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-xl">What is your main goal with fertility testing?</h3>
              <div className="space-y-3">
                {[
                  { value: 'baseline', label: 'Get a baseline understanding of my fertility' },
                  { value: 'planning', label: 'Plan for future family building' },
                  { value: 'trouble-conceiving', label: 'Investigate why I\'m having trouble conceiving' },
                  { value: 'egg-freezing', label: 'Considering egg freezing' },
                  { value: 'ivf', label: 'Preparing for IVF treatment' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswers({ ...answers, testingGoal: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      answers.testingGoal === option.value
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