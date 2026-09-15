import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/components/catalogue";
import Storefront from "@/components/storefront";
export const dynamicParams = false;
export function generateStaticParams() { return categories.map((item) => ({ category: item.id })); }
type Props = { params: Promise<{ category: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const item = categories.find((item) => item.id === category);
  if (!item) notFound();
  return { title: item.name + " | Soft Life Club", description: item.description };
}
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!categories.some((item) => item.id === category)) notFound();
  return <Storefront key={category} categoryId={category} />;
}
