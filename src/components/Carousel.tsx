import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
    src: string;
    alt: string;
}

interface GalleryCarouselProps {
    images: Image[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const stopAutoPlay = useCallback(() => {
        setIsAutoPlay(false);
    }, []);

    const scrollPrev = useCallback(() => {
        if (emblaApi) {
            stopAutoPlay();
            emblaApi.scrollPrev();
        }
    }, [emblaApi, stopAutoPlay]);

    const scrollNext = useCallback(() => {
        if (emblaApi) {
            stopAutoPlay();
            emblaApi.scrollNext();
        }
    }, [emblaApi, stopAutoPlay]);

    // Track user drag interaction
    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('pointerDown', stopAutoPlay);
        return () => { emblaApi.off('pointerDown', stopAutoPlay); }
    }, [emblaApi, stopAutoPlay]);

    // Auto-rotating timer
    useEffect(() => {
        if (!emblaApi || !isAutoPlay) return;

        // Auto-play the carousel every 5 seconds
        const interval = setInterval(() => {
            // Check if user is interacting with it (pointer down)
            if (emblaApi.internalEngine().dragHandler.pointerDown()) return;
            emblaApi.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [emblaApi, isAutoPlay]);

    if (!images || images.length === 0) {
        return <div className="p-8 text-center text-slate-500 bg-slate-100 rounded-xl">No images provided to carousel</div>;
    }

    return (
        <div className="relative group max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex backface-hidden touch-pan-y h-[50vh] min-h-[400px] md:min-h-[600px]">
                    {images.map((img, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center" key={index}>
                            <div
                                className="absolute inset-0 bg-contain bg-no-repeat bg-center transition-transform duration-1000 ease-in-out hover:scale-105"
                                style={{ backgroundImage: `url(${img.src})` }}
                                aria-label={img.alt}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                onClick={scrollPrev}
                aria-label="Previous image"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                onClick={scrollNext}
                aria-label="Next image"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}
