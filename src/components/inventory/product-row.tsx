import type { Product } from "../../types/Product"
import { getCategoryName, getStockStatus } from "../../api/getNames"
import { ChevronDown, ChevronRight } from "lucide-react"
import { ProductExpandedDetails } from "./product-expanded-details"

interface ProductRowProps {
  product: Product
  isExpanded: boolean
  onToggleExpand: () => void
}

export function ProductRow({ product, isExpanded, onToggleExpand }: ProductRowProps) {
  const stockStatus = getStockStatus(product)

  const rowClasses =
    "border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors" +
    (isExpanded ? " bg-gray-50" : "")

  const stockColorClass =
    stockStatus.color === "green"
      ? "bg-green-500"
      : stockStatus.color === "yellow"
        ? "bg-yellow-500"
        : stockStatus.color === "red"
          ? "bg-red-500"
          : ""

  return (
    <>
      <tr className={rowClasses} onClick={onToggleExpand}>
        <td className="p-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">No img</span>
              </div>
            )}
          </div>
        </td>

        <td className="p-4">
          <span className="text-sm text-gray-600">{product.codigo}</span>
        </td>

        <td className="p-4">
          <div>
            <span className="font-medium">{product.nombre}</span>
          </div>
        </td>

        <td className="p-4">
          <span className="text-sm">{getCategoryName(product.categoria)}</span>
        </td>

        <td className="p-4">
          <div>
            <span className="font-medium">S/.{product.precio_venta.toLocaleString()}</span>
            <div className="text-xs text-gray-600">Costo: S/.{product.precio_compra.toLocaleString()}</div>
          </div>
        </td>

        <td className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${stockColorClass}`} />
            <span className="text-sm font-medium">{product.stock_actual}</span>
          </div>
          <div className="text-xs text-gray-600">Min: {product.stock_minimo}</div>
        </td>

        <td className="p-4">
          <button
            className="text-gray-600 hover:text-gray-900 transition-transform"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={8} className="p-0">
            <ProductExpandedDetails product={product} />
          </td>
        </tr>
      )}
    </>
  )
}
