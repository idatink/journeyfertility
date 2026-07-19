import { useState } from 'react';
import { Check, Star, Clock, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

interface AtHomeTestKit {
  id: number;
  name: string;
  provider: string;
  price: number;
  testsIncluded: string[];
  turnaroundTime: string;
  hsaEligible: boolean;
  nurseConsult: boolean;
  rating: number;
  reviews: number;
  badge?: string;
}

const testKits: AtHomeTestKit[] = [
  {
    id: 1,
    name: 'Modern Fertility Hormone Test',
    provider: 'Modern Fertility',
    price: 159,
    testsIncluded: ['AMH', 'FSH', 'TSH', 'LH', 'E2', 'Prolactin', 'fT4', 'T3', 'Testosterone'],
    turnaroundTime: '7-10 days',
    hsaEligible: true,
    nurseConsult: true,
    rating: 4.8,
    reviews: 12453,
    badge: 'Most Popular'
  },
  {
    id: 2,
    name: "Everlywell Women's Fertility Test",
    provider: 'Everlywell',
    price: 149,
    testsIncluded: ['AMH', 'TSH', 'fT4', 'Cortisol', 'DHEA-S'],
    turnaroundTime: '5-7 days',
    hsaEligible: true,
    nurseConsult: false,
    rating: 4.6,
    reviews: 8742,
    badge: 'Best Value'
  },
  {
    id: 3,
    name: 'LetsGetChecked Ovarian Reserve Test',
    provider: 'LetsGetChecked',
    price: 139,
    testsIncluded: ['AMH'],
    turnaroundTime: '2-5 days',
    hsaEligible: true,
    nurseConsult: true,
    rating: 4.7,
    reviews: 5621,
    badge: 'Fastest Results'
  },
  {
    id: 4,
    name: 'myLAB Box At Home Fertility Test',
    provider: 'myLAB Box',
    price: 179,
    testsIncluded: ['AMH', 'FSH', 'LH', 'E2', 'Progesterone'],
    turnaroundTime: '2-5 days',
    hsaEligible: true,
    nurseConsult: true,
    rating: 4.5,
    reviews: 4329,
    badge: 'Most Comprehensive'
  }
];

export function AtHomeTestKitsComparison() {
  const [selectedKits, setSelectedKits] = useState<number[]>([]);

  const toggleKitSelection = (id: number) => {
    setSelectedKits(prev =>
      prev.includes(id) ? prev.filter(kitId => kitId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">At-Home Fertility Test Kits</h2>
          <p className="text-gray-600">Compare {testKits.length} popular at-home test options</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#EEF2FE] p-4 rounded-lg border border-[#CBD8F5]">
          <div className="text-sm text-[#5B6AA5] mb-1">Lowest Price</div>
          <div className="text-2xl">${Math.min(...testKits.map(k => k.price))}</div>
          <div className="text-sm text-gray-500 mt-1">LetsGetChecked</div>
        </div>
        <div className="bg-[#EEF2FE] p-4 rounded-lg border border-[#CBD8F5]">
          <div className="text-sm text-[#5B6AA5] mb-1">Average Price</div>
          <div className="text-2xl">${Math.round(testKits.reduce((acc, k) => acc + k.price, 0) / testKits.length)}</div>
          <div className="text-sm text-gray-500 mt-1">Across all kits</div>
        </div>
        <div className="bg-[#EEF2FE] p-4 rounded-lg border border-[#CBD8F5]">
          <div className="text-sm text-[#5B6AA5] mb-1">Fastest Results</div>
          <div className="text-2xl">2-5 days</div>
          <div className="text-sm text-gray-500 mt-1">LetsGetChecked</div>
        </div>
        <div className="bg-[#EEF2FE] p-4 rounded-lg border border-[#CBD8F5]">
          <div className="text-sm text-[#5B6AA5] mb-1">All HSA/FSA</div>
          <div className="text-2xl">100%</div>
          <div className="text-sm text-gray-500 mt-1">Eligible</div>
        </div>
      </div>

      {/* Test Kits Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {testKits.map((kit) => (
          <div
            key={kit.id}
            className={`border-2 rounded-xl p-6 transition-all ${
              selectedKits.includes(kit.id)
                ? 'border-[#A8BEEB] bg-[#EEF2FE]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Header with badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl mb-1">{kit.name}</h3>
                <p className="text-sm text-gray-600">{kit.provider}</p>
              </div>
              {kit.badge && (
                <span className="bg-[#A8BEEB] text-white px-3 py-1 rounded-full text-sm">
                  {kit.badge}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="text-3xl text-[#A8BEEB]">${kit.price}</div>
              {kit.hsaEligible && (
                <p className="text-sm text-gray-600 mt-1">HSA/FSA eligible</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#A8BEEB] text-[#A8BEEB]" />
                <span>{kit.rating}</span>
              </div>
              <span className="text-sm text-gray-600">
                ({kit.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-[#A8BEEB] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Turnaround Time</p>
                  <p className="text-sm text-gray-600">{kit.turnaroundTime}</p>
                </div>
              </div>

              {kit.nurseConsult && (
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#A8BEEB] flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Free nurse consultation included</p>
                </div>
              )}
            </div>

            {/* Tests Included */}
            <div className="mb-4">
              <p className="text-sm mb-2">Tests Included:</p>
              <div className="flex flex-wrap gap-2">
                {kit.testsIncluded.map((test, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                  >
                    {test}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toggleKitSelection(kit.id)}
              >
                {selectedKits.includes(kit.id) ? 'Selected' : 'Select to Compare'}
              </Button>
              <Button className="flex-1 bg-[#2F3440] hover:bg-[#434A5C]">
                Order Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-br from-[#E7EDFD] to-[#EEF2FE] rounded-xl p-6">
        <h3 className="text-xl mb-3">Why Choose At-Home Testing?</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-[#A8BEEB] flex-shrink-0 mt-0.5" />
            <div>
              <p><strong>Convenient</strong></p>
              <p className="text-gray-600">Test from home, no appointment needed</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-[#A8BEEB] flex-shrink-0 mt-0.5" />
            <div>
              <p><strong>Affordable</strong></p>
              <p className="text-gray-600">$139-$179 vs $500-$1,000 at clinics</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-[#A8BEEB] flex-shrink-0 mt-0.5" />
            <div>
              <p><strong>Accurate</strong></p>
              <p className="text-gray-600">CLIA-certified labs, same as doctor's office</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {selectedKits.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-[#EEF2FE] rounded-lg border border-[#CBD8F5]">
          <div className="text-sm">
            <span className="text-[#5B6AA5]">
              {selectedKits.length} kit{selectedKits.length > 1 ? 's' : ''}
            </span>{' '}
            selected
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Compare Selected
            </Button>
            <Button size="sm">View Comparison</Button>
          </div>
        </div>
      )}
    </div>
  );
}
