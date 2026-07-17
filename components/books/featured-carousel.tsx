"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Book } from "@/types";
import { BookCard } from "@/components/books/book-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedCarouselProps {
  books: Book[];
}

export function FeaturedCarousel({ books }: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
      "(min-width: 1280px)": { slidesToScroll: 4 },
    },
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!books || books.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden py-8 -my-8 px-4 -mx-4" ref={emblaRef}>
        <div className="flex gap-6">
          {books.map((book) => (
            <div key={book._id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_23%] min-w-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls - visible mostly on desktop on hover */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-background border border-border shadow-xl flex items-center justify-center text-primary transition-all z-10",
          !prevBtnEnabled ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
        )}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-12 w-12 rounded-full bg-background border border-border shadow-xl flex items-center justify-center text-primary transition-all z-10",
          !nextBtnEnabled ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
        )}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
