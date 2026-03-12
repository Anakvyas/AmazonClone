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
} from "@/components/ui/carousel";
import { getProducts } from "@/service/api";
import Image from "next/image";

export default async function Home() {
  const initialProducts = await getProducts(
    { page: 1, limit: 10 },
    { cache: "force-cache", next: { revalidate: 60, tags: ["products"] } }
  );

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
                className="w-full"
                height={1080}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="p-10">
        <ProductsList
          initialProducts={initialProducts.items}
          initialHasMore={initialProducts.hasMore}
        />
      </div>
    </div>
  );
}
