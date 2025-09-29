import { ChevronDown } from "lucide-react";
import type { Product } from "../../types/Product";
import { useEffect, useState } from "react";
import { getCategories, getBrands } from "../../api/getNames";
import type { Category } from "../../types/Category";
import type { Brand } from "../../types/Brand";

interface ProductCategoryBrandFormProps {
  product: Product;
}

export function ProductCategoryBrandForm({ product }: ProductCategoryBrandFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
    getBrands().then((data) => setBrands(data));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <div className="relative mt-1">
            <select
              defaultValue={product.categoria?.toString() || ""}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Marca</label>
          <div className="relative mt-1">
            <select
              defaultValue={product.marca?.toString() || ""}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            >
              <option value="">Seleccionar marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id.toString()}>
                  {brand.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <div className="relative mt-1">
          <select
            defaultValue={product.estado?.toString() || "1"}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
          >
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
