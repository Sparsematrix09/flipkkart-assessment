import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ProductCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  
  const next = () => setCurrent((current + 1) % images.length);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  
  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-sm p-8 text-center">
        <div className="text-gray-400">No image available</div>
      </div>
    );
  }
  
  return (
    <div className="relative bg-white rounded-sm overflow-hidden">
      <div className="relative h-[400px]">
        <img 
          src={images[current]} 
          alt={`Product view ${current + 1}`} 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 pb-4 overflow-x-auto no-scrollbar">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-16 h-16 cursor-pointer border-2 rounded overflow-hidden flex-shrink-0 ${
                idx === current ? 'border-flipkart-blue' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="carousel-button absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-flipkart-blue hover:text-white transition-all"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="carousel-button absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-flipkart-blue hover:text-white transition-all"
          >
            <FaChevronRight />
          </button>
        </>
      )}
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}