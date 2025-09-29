
import type { Product } from "../../types/Product"

interface ProductImageDisplayProps {
  product: Product
}

export function ProductImageDisplay({ product }: ProductImageDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden mx-auto">
        {product.image_url ? (
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-500">+ Add image</span>
          </div>
        )}
      </div>
    </div>
  )
}
