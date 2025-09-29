import type { Product } from "../../types/Product"
import { getCategoryName} from "../../api/getNames"

interface ProductStockInfoProps {
  product: Product
  isEditing: boolean
  editedProduct: Product
  setEditedProduct: (product: Product) => void
  onSave: () => void
  onCancel: () => void
  onEdit: () => void
}

export function ProductStockInfo({
  product,
  isEditing,
  editedProduct,
  setEditedProduct,
  onSave,
  onCancel,
  onEdit,
}: ProductStockInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground">Collection</label>
        <div className="text-sm">{getCategoryName(product.categoria)}</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Stock</label>
          {isEditing ? (
            <input
              type="number"
              value={editedProduct.stock_actual}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, stock_actual: Number.parseInt(e.target.value) })
              }
              className="mt-1 border rounded px-2 py-1 w-full"
            />
          ) : (
            <div className="text-sm font-medium">{product.stock_actual}</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4">
        {isEditing ? (
          <>
            <button
              type="button"
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              onClick={onSave}
            >
              Save
            </button>
            <button
              type="button"
              className="px-3 py-1 border border-gray-400 rounded text-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="px-3 py-1 border border-gray-400 rounded text-sm"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
      </div>

      <div className="text-xs text-muted-foreground pt-2">✓ AUTOMATICALLY SAVED</div>
    </div>
  )
}
