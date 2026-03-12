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

interface HomePageProps {
  searchParams?: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const search = params?.search?.trim() || undefined;
  const category =
    params?.category && params.category !== "All" ? params.category : undefined;

  const initialProducts = await getProducts(
    { page: 1, limit: 10, search, category },
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
          searchQuery={search ?? ""}
          category={category ?? "All"}
        />
      </div>
    </div>
  );
}
