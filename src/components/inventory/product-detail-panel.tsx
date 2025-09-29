import { X } from "lucide-react"
import type { Product } from "../../types/Product"
import { ProductImageSection } from "./product-image-section"
import { ProductDetailsForm } from "./product-details-form"
import { ProductActions } from "./product-actions"

interface ProductDetailPanelProps {
  product: Product | null
  onClose: () => void
}

export function ProductDetailPanel({ product, onClose }: ProductDetailPanelProps) {
  if (!product) return null

  return (
    <div className="w-96 bg-card border-l border-border p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Product Details</h3>
        <button
          type="button"
          className="ghost sm"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ProductImageSection imageUrl={product.image_url} productName={product.nombre} />

      <ProductDetailsForm product={product} />

      <ProductActions />
    </div>
  )
}
