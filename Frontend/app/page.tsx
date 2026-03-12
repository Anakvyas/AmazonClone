import {
  bannerFive,
  bannerFour,
  bannerOne,
  bannerThree,
  bannerTwo,
} from "@/assets";
import ProductsList from "@/components/ProductsList";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/ui/carousel";
import Image from "next/image";

export default function Home() {
  const bannerImages = [
    { title: "bannerOne", source: bannerOne },
    { title: "bannerTwo", source: bannerTwo },
    { title: "bannerThree", source: bannerThree },
    { title: "bannerFour", source: bannerFour },
    { title: "bannerFive", source: bannerFive },
  ];
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {bannerImages?.map((item) => (
            <CarouselItem key={item?.title}>
              <Image
                src={item?.source}
                alt="bannerOne"
                className="h-auto w-full"
                width={1600}
                height={1080}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="p-10">
        <ProductsList />
      </div>
    </div>
  );
}
