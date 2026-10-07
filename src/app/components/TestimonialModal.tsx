import { X, Play, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TestimonialModalProps {
  testimonial: {
    name: string;
    image: string;
    tags: string[];
    quote: string;
    service: string;
  };
  onClose: () => void;
}

export function TestimonialModal({ testimonial, onClose }: TestimonialModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl h-[600px] rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image */}
        <ImageWithFallback
          src={testimonial.image}
          alt={testimonial.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {testimonial.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Name */}
            <h2 className="text-white text-5xl md:text-6xl mb-4">{testimonial.name}</h2>
            
            {/* Verified Badge */}
            <div className="flex items-center gap-2 mb-8">
              <CheckCircle2 className="w-6 h-6 text-[#C3D3E2]" fill="currentColor" />
              <span className="text-white text-lg">Verified JourneyFertility customer</span>
            </div>
          </div>
          
          {/* Middle Section - Quote & Service */}
          <div className="space-y-4 max-w-lg">
            {/* Quote */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <p className="text-white text-xl italic text-center">
                "{testimonial.quote}"
              </p>
            </div>
            
            {/* Service Used */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
              <p className="text-white/80 text-sm mb-2">Service used</p>
              <p className="text-white text-xl">{testimonial.service}</p>
            </div>
          </div>
          
          {/* Play Button - Center Right */}
          <button className="absolute right-12 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110">
            <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
          </button>
          
          {/* Close Button - Bottom Right */}
          <button 
            onClick={onClose}
            className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <div className="w-6 h-0.5 bg-gray-900"></div>
          </button>
        </div>
      </div>
    </div>
  );
}