import React from 'react';
import { Button } from './ui/button';
import { Download, ChevronLeft, Image as ImageIcon, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import img_1586489250068a288824b3438 from '../../assets/photos/photo-1586489250068-a288824b3438.jpg';
import img_16169966913564659297f4baf from '../../assets/photos/photo-1616996691356-4659297f4baf.jpg';
import img_1679496124845ac6957c8bffd from '../../assets/photos/photo-1679496124845-ac6957c8bffd.jpg';
import img_1760861715390d85bd4eb617e from '../../assets/photos/photo-1760861715390-d85bd4eb617e.jpg';

interface MarketingAssetsProps {
  onBack: () => void;
}

export function MarketingAssets({ onBack }: MarketingAssetsProps) {
  const assets = [
    {
      id: 1,
      title: 'Modern Fertility Lab Environment',
      description: 'High-resolution image of our state-of-the-art laboratory facilities.',
      url: img_16169966913564659297f4baf,
      category: 'Clinical'
    },
    {
      id: 2,
      title: 'Microscopy and Embryology',
      description: 'Close-up detail of clinical embryology procedures and equipment.',
      url: img_1679496124845ac6957c8bffd,
      category: 'Clinical'
    },
    {
      id: 3,
      title: 'Expert Consultation',
      description: 'Patient-centric care and consultation atmosphere in our partner clinics.',
      url: img_1586489250068a288824b3438,
      category: 'Lifestyle'
    },
    {
      id: 4,
      title: 'Laboratory Precision',
      description: 'The precision and care taken in every step of the fertility journey.',
      url: img_1760861715390d85bd4eb617e,
      category: 'Clinical'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-8 hover:bg-[#EEF2FE] -ml-2"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="mb-12">
        <h1 className="text-4xl font-serif mb-4 text-[#A8BEEB]">PR & Marketing Assets</h1>
        <p className="text-gray-600 max-w-2xl text-lg">
          Download high-quality visuals and media assets for press, marketing, and social media. 
          All images are provided in 550x344 optimized for online posting.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-2xl overflow-hidden border border-[#CBD8F5] shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-[550/344] overflow-hidden">
              <ImageWithFallback 
                src={asset.url} 
                alt={asset.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-[#A8BEEB]">
                  {asset.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{asset.title}</h3>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#A8BEEB] transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                {asset.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">Format: 550x344px • JPG</span>
                <Button className="bg-[#A8BEEB] hover:bg-[#6B7FC7]">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-[#EEF2FE] rounded-2xl p-8 border border-[#CBD8F5]">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white rounded-xl text-[#A8BEEB]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold">Need custom assets?</h2>
        </div>
        <p className="text-gray-600 mb-6">
          If you require specific resolutions, raw video footage, or brand guidelines for JourneyFertility, 
          please contact our press office.
        </p>
        <Button variant="outline" className="border-[#A8BEEB] text-[#A8BEEB] hover:bg-[#A8BEEB] hover:text-white">
          Contact PR Team
        </Button>
      </div>
    </div>
  );
}
