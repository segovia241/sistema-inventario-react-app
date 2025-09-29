import type { Product } from "../../types/Product"

interface ProductMetadataFormProps {
  product: Product
}

export function ProductMetadataForm({ product }: ProductMetadataFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-1 mt-1">
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div>
          <label className="text-sm font-medium">Creado</label>
          <div className="mt-1 text-sm">{product.created_at.toLocaleString()}</div>
        </div>
        <div>
          <label className="text-sm font-medium">Actualizado</label>
          <div className="mt-1 text-sm">{product.updated_at.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
