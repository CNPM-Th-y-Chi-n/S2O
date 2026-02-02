import { useState, useRef, MouseEvent } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  rating: number;
}

export function ProductCard({ image, title, description, price, rating }: ProductCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-[380px] h-[520px] cursor-pointer"
      style={{
        perspective: '1000px',
      }}
    >
      <div
        className="relative w-full h-full rounded-3xl bg-white shadow-2xl overflow-hidden transition-all duration-200 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovering ? 'scale(1.05)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovering
            ? `${rotateY * 2}px ${rotateX * 2}px 40px rgba(0, 0, 0, 0.3)`
            : '0 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200"
          style={{
            opacity: isHovering ? 0.15 : 0,
            background: `radial-gradient(circle at ${((rotateY + 15) / 30) * 100}% ${((rotateX + 15) / 30) * 100}%, rgba(255, 255, 255, 0.8), transparent 50%)`,
          }}
        />

        {/* Product Image */}
        <div className="relative h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              transform: `translateZ(40px) scale(0.95)`,
            }}
          />
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm">
            NEW
          </div>
        </div>

        {/* Product Info */}
        <div
          className="p-6 flex flex-col gap-3"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({rating}.0)</span>
          </div>

          {/* Title */}
          <h3 className="text-gray-900">{title}</h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>

          {/* Price and CTA */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-900">{price}</span>
            <button
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
              style={{
                transform: 'translateZ(10px)',
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
