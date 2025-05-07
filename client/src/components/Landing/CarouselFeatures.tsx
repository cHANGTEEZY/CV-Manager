'use client';

import { useState, useEffect } from 'react';
import { carouselContent } from '@/constants/LandingCarousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

export const CarouselFeatures = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="mx-auto px-4 pb-16">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'center',
          loop: true,
          skipSnaps: false,
          containScroll: 'trimSnaps',
        }}
      >
        <CarouselContent className="-ml-4">
          {carouselContent.map((content, index) => (
            <CarouselItem
              key={index}
              className={cn(
                'pl-4 md:basis-2/3 lg:basis-1/2',
                isMobile ? 'basis-full' : 'basis-4/5'
              )}
            >
              <div className="p-1">
                <Card
                  className={cn(
                    'max-h-[900px] overflow-hidden border-0 bg-gradient-to-b from-gray-700 via-gray-300 to-stone-500 transition-all duration-300',
                    current === index
                      ? 'scale-100 opacity-100'
                      : 'scale-95 opacity-70'
                  )}
                >
                  <CardHeader>
                    <CardDescription>{content.title}</CardDescription>
                    <CardTitle className="text-3xl text-slate-200">
                      {content.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-3xl">
                      <img
                        src={
                          content.image ||
                          '/placeholder.svg?height=400&width=600'
                        }
                        alt={content.description}
                        className="h-auto w-full rounded-3xl object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute right-0 -bottom-12 left-0 flex justify-center gap-2 py-4">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition-all',
                current === index
                  ? 'w-8 bg-white'
                  : 'bg-gray-400 opacity-50 hover:opacity-75',
                'cursor-pointer'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <CarouselPrevious className="left-4 h-12 w-12 cursor-pointer border-2" />
        <CarouselNext className="right-4 h-12 w-12 cursor-pointer border-2" />
      </Carousel>
    </div>
  );
};

export default CarouselFeatures;
