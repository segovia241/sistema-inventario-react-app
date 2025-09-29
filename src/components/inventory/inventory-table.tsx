import { useState } from "react"
import { ProductRow } from "./product-row"
import { getStockStatus } from "../../api/getNames"
import type { Product } from "../../types/Product"

interface InventoryTableProps {
  products: Product[]
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [stockFilter, setStockFilter] = useState("all")
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)

  const handleToggleExpand = (productId: number) => {
    setExpandedProduct(expandedProduct === productId ? null : productId)
  }

  const filteredProducts = products.filter((product) => {
    const stockStatus = getStockStatus(product)
    if (stockFilter === "in-stock") return stockStatus.status === "in-stock"
    if (stockFilter === "low-stock") return stockStatus.status === "low-stock"
    if (stockFilter === "out-of-stock") return stockStatus.status === "out-of-stock"
    return true
  })

  return (
    <div className="flex-1 overflow-hidden">
      {/* Stock Filter */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-32"
          >
            <option value="all">Mostrar todo</option>
            <option value="in-stock">En Stock</option>
            <option value="low-stock">Bajo Stock</option>
            <option value="out-of-stock">Sin Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">#</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">SKU</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Nombre</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Categoría</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Precio</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Stock</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id_producto}
                product={product}
                isExpanded={expandedProduct === product.id_producto}
                onToggleExpand={() => handleToggleExpand(product.id_producto)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
