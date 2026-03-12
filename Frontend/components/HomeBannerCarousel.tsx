"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BannerImage {
  title: string;
  source: StaticImageData;
}

interface HomeBannerCarouselProps {
  images: BannerImage[];
}

export default function HomeBannerCarousel({
  images,
}: HomeBannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || images.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
        return;
      }

      api.scrollTo(0);
    }, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [api, images.length]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: false, align: "start" }}
      className="relative"
    >
      <CarouselContent>
        {images.map((item) => (
          <CarouselItem key={item.title}>
            <div className="relative w-full overflow-hidden bg-[#f7f8fa]">
              <Image
                src={item.source}
                alt={item.title}
                className="h-[240px] w-full object-cover object-[center_15%] md:h-[360px] lg:h-[460px]"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f3f4f6] via-[#f3f4f6]/70 to-transparent" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-4 top-1/2 z-10 hidden -translate-y-1/2 border-white/40 bg-black/30 text-white hover:bg-black/50 md:flex" />
      <CarouselNext className="right-4 top-1/2 z-10 hidden -translate-y-1/2 border-white/40 bg-black/30 text-white hover:bg-black/50 md:flex" />

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {images.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all ${
              current === index
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to ${item.title}`}
          />
        ))}
      </div>
    </Carousel>
  );
}
