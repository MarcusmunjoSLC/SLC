import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Storefront from "@/components/storefront";
import { products } from "@/components/catalogue";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((product) => product.id === slug);
  if (!product) notFound();
  return {
    title: `${product.name} | Soft Life Club`,
    description: `${product.name} in ${product.colourName}. 100% cotton, oversized fit and premium heavyweight fabric.`,
  };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!products.some((product) => product.id === slug)) notFound();
  return <Storefront key={slug} productId={slug} />;
}
