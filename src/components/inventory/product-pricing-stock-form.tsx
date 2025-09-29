
import type { Product } from "../../types/Product"

interface ProductPricingStockFormProps {
  product: Product
}

export function ProductPricingStockForm({ product }: ProductPricingStockFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio Compra</label>
          <input
            type="text"
            value={`$${product.precio_compra.toLocaleString()}`}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio Venta</label>
          <input
            type="text"
            value={`$${product.precio_venta.toLocaleString()}`}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Actual</label>
          <input
            type="number"
            value={product.stock_actual}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
          <input
            type="number"
            value={product.stock_minimo}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
      </div>
    </div>
  )
}
