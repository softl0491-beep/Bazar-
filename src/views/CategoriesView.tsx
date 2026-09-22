import { StoreCategory, Product } from '../types';

interface CategoriesViewProps {
  categories: StoreCategory[];
  products: Product[];
  onSelectCategory: (catId: string) => void;
  onOpenProduct: (product: Product) => void;
}

export default function CategoriesView({
  categories,
  products,
  onSelectCategory,
  onOpenProduct,
}: CategoriesViewProps) {
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.cat.toLowerCase() === catId.toLowerCase()).length;
  };

  const getCategoryFeaturedProduct = (catId: string) => {
    if (catId === 'all') return products[0];
    return products.find((p) => p.cat.toLowerCase() === catId.toLowerCase()) || products[0];
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-4 space-y-4 pt-2">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eaedff]">
        <h2 className="font-sans text-lg font-bold text-[#131b2e]">Explore Categories</h2>
        <p className="font-sans text-xs text-[#434655]">
          Browse our curated departments with verified products and instant WhatsApp dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((c) => {
          const count = getCategoryCount(c.id);
          const sampleProd = getCategoryFeaturedProduct(c.id);

          return (
            <div
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#eaedff] flex items-center justify-between cursor-pointer hover:border-[#0037b0] transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] group-hover:bg-[#dce1ff] text-[#0037b0] flex items-center justify-center shrink-0 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">{c.icon}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-sm font-bold text-[#131b2e] group-hover:text-[#0037b0] transition-colors truncate">
                    {c.name}
                  </h3>
                  <span className="font-mono text-xs text-[#747686]">
                    {count} Products
                  </span>
                </div>
              </div>

              {sampleProd && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f2f3ff] shrink-0 ml-2 border border-[#eaedff]">
                  <img src={sampleProd.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
