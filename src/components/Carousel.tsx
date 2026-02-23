import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
    src: string;
    alt: string;
    caption?: string;
}

interface GalleryCarouselProps {
    images: Image[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Auto-rotating timer
    useEffect(() => {
        if (!emblaApi) return;

        // Auto-play the carousel every 5 seconds
        const interval = setInterval(() => {
            // Check if user is interacting with it (pointer down)
            if (emblaApi.internalEngine().dragHandler.pointerDown()) return;
            emblaApi.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [emblaApi]);

    if (!images || images.length === 0) {
        return <div className="p-8 text-center text-slate-500 bg-slate-100 rounded-xl">No images provided to carousel</div>;
    }

    return (
        <div className="relative group max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex backface-hidden touch-pan-y h-[50vh] min-h-[400px] md:min-h-[600px]">
                    {images.map((img, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center" key={index}>
                            {/* Dynamic Image src placeholder replacement since we don't have actual files here. But using src in reality */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out hover:scale-105"
                                style={{ backgroundImage: `url(${img.src})` }}
                                aria-label={img.alt}
                            />

                            {/* Fallback pattern if image is missing */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                <span className="text-white text-9xl alpha-10">{index + 1}</span>
                            </div>

                            {img.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20">
                                    <p className="text-white text-lg font-medium">{img.caption}</p>
                                </div>
                            )}
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

            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white/80 text-xs tracking-widest uppercase">
                Auto-Rotating
            </div>
        </div>
    );
}
