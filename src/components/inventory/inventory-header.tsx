import { Search, ChevronDown } from "lucide-react";
import type { Category } from "../../types/Category";
import type { Brand } from "../../types/Brand";

interface InventoryHeaderProps {
  selectedCategory: string;
  selectedBrand: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onSearchChange: (query: string) => void;
  categories: Category[];
  brands: Brand[];
}

export function InventoryHeader({
  selectedCategory,
  selectedBrand,
  searchQuery,
  onCategoryChange,
  onBrandChange,
  onSearchChange,
  categories,
  brands,
}: InventoryHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-semibold">Inventario</h1>

        <div className="flex items-center space-x-4">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Categoria:</span>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Marca:</span>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
              >
                <option value="all">Todas</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id.toString()}>
                    {brand.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
