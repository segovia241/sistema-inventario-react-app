
import { useState } from "react"
import type { Product } from "../../types/Product"
import { ProductImageDisplay } from "./product-image-display"
import { ProductDetailsDisplay } from "./product-details-display"
import { ProductStockInfo } from "./product-stock-info"

interface ProductExpandedDetailsProps {
  product: Product
}

export function ProductExpandedDetails({ product }: ProductExpandedDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState<Product>(product)

  const handleSave = () => {
    console.log("[v0] Saving product:", editedProduct)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProduct(product)
    setIsEditing(false)
  }

  return (
    <div className="p-6 border-l-4 border-primary/20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductImageDisplay product={product} />

        <ProductDetailsDisplay
          product={product}
          isEditing={isEditing}
          editedProduct={editedProduct}
          setEditedProduct={setEditedProduct}
        />

        <ProductStockInfo
          product={product}
          isEditing={isEditing}
          editedProduct={editedProduct}
          setEditedProduct={setEditedProduct}
          onSave={handleSave}
          onCancel={handleCancel}
          onEdit={() => setIsEditing(true)}
        />
      </div>
    </div>
  )
}
