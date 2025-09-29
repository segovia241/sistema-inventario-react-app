
import type { Product } from "../../types/Product"
import { ProductBasicInfoForm } from "./product-basic-info-form"
import { ProductCategoryBrandForm } from "./product-category-brand-form"
import { ProductPricingStockForm } from "./product-pricing-stock-form"
import { ProductMetadataForm } from "./product-metadata-form"

interface ProductDetailsFormProps {
  product: Product
}

export function ProductDetailsForm({ product }: ProductDetailsFormProps) {
  return (
    <div className="space-y-6 mb-6">
      <ProductBasicInfoForm product={product} />
      <ProductCategoryBrandForm product={product} />
      <ProductPricingStockForm product={product} />
      <ProductMetadataForm product={product} />
    </div>
  )
}
