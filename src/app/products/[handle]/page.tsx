import { notFound } from 'next/navigation';
import { SHOP_ALL } from '@/data/driftProducts';
import { ProductPage } from '@/components/ProductPage';

export function generateStaticParams() {
  return SHOP_ALL.map(({ handle }) => ({ handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = SHOP_ALL.find(p => p.handle === handle);
  return { title: product ? `${product.title} | DRIFT` : 'Product not found | DRIFT' };
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = SHOP_ALL.find(p => p.handle === handle);
  if (!product) notFound();
  return <ProductPage key={handle} product={product} />;
}
