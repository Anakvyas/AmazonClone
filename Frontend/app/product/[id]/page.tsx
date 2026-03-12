import ProductDetailsClient from "@/components/ProductDetailsClient";
import { getProductById, mapBackendProductToUi } from "@/service/api";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProductById(id, {
      cache: "force-cache",
      next: { revalidate: 60, tags: [`product-${id}`, "products"] },
    });

    return <ProductDetailsClient product={mapBackendProductToUi(product)} />;
  } catch {
    notFound();
  }
}
