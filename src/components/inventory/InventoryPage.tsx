import { useState, useEffect, useMemo } from "react";
import { InventoryHeader } from "./inventory-header";
import { InventoryTable } from "./inventory-table";
import { getProducts } from "../../api/products";
import { getCategories, getBrands } from "../../api/getNames";
import type { Product } from "../../types/Product";
import type { Category } from "../../types/Category";
import type { Brand } from "../../types/Brand";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar productos, categorías y marcas
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || (product.categoria?.toString() === selectedCategory);

      const matchesBrand =
        selectedBrand === "all" || (product.marca?.toString() === selectedBrand);

      const matchesSearch =
        searchQuery === "" ||
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (product.modelo?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  // Mostrar loading o error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500 text-lg">Cargando inventario...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-red-500 text-lg">{error}</span>
      </div>
    );
  }

  // Render principal
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <InventoryHeader
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onBrandChange={setSelectedBrand}
            onSearchChange={setSearchQuery}
            categories={categories}
            brands={brands}
          />

          <div className="flex flex-1 overflow-hidden">
            <InventoryTable products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}