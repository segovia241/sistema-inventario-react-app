import type { Product } from "../../types/Product";
import { useEffect, useState } from "react";
import { getBrandName, getBrands } from "../../api/getNames";
import type { Brand } from "../../types/Brand";

interface ProductDetailsDisplayProps {
  product: Product;
  isEditing: boolean;
  editedProduct: Product;
  setEditedProduct: (product: Product) => void;
}

export function ProductDetailsDisplay({
  product,
  isEditing,
  editedProduct,
  setEditedProduct,
}: ProductDetailsDisplayProps) {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getBrands().then((data) => setBrands(data));
  }, []);

  return (
    <div className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Nombre</label>
        {isEditing ? (
          <input
            type="text"
            value={editedProduct.nombre}
            onChange={(e) => setEditedProduct({ ...editedProduct, nombre: e.target.value })}
            className="mt-1 border rounded px-2 py-1 w-full"
          />
        ) : (
          <div className="text-sm font-medium">{product.nombre}</div>
        )}
      </div>

      {/* SKU y Barcode */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">SKU</label>
          <div className="text-sm">{product.codigo}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Código de barras</label>
          <div className="text-sm">{product.barcode || "N/A"}</div>
        </div>
      </div>

      {/* Precio y Costo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Precio</label>
          {isEditing ? (
            <input
              type="number"
              value={editedProduct.precio_venta}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, precio_venta: Number.parseInt(e.target.value) })
              }
              className="mt-1 border rounded px-2 py-1 w-full"
            />
          ) : (
            <div className="text-sm font-medium">S/.{product.precio_venta.toLocaleString()}</div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Costo</label>
          {isEditing ? (
            <input
              type="number"
              value={editedProduct.precio_compra}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, precio_compra: Number.parseInt(e.target.value) })
              }
              className="mt-1 border rounded px-2 py-1 w-full"
            />
          ) : (
            <div className="text-sm">S/.{product.precio_compra.toLocaleString()}</div>
          )}
        </div>
      </div>

      {/* Marca y Modelo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Marca</label>
          {isEditing ? (
            <select
              value={editedProduct.marca?.toString() || ""}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, marca: Number.parseInt(e.target.value) })
              }
              className="mt-1 border rounded px-2 py-1 w-full"
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id.toString()}>
                  {brand.nombre}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm">{getBrandName(product.marca)}</div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Modelo</label>
          {isEditing ? (
            <input
              type="text"
              value={editedProduct.modelo || ""}
              onChange={(e) => setEditedProduct({ ...editedProduct, modelo: e.target.value })}
              className="mt-1 border rounded px-2 py-1 w-full"
            />
          ) : (
            <div className="text-sm">{product.modelo || "N/A"}</div>
          )}
        </div>
      </div>

      {/* Vendor */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
        <div className="text-sm">{product.vendor || "N/A"}</div>
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Descripción</label>
        {isEditing ? (
          <textarea
            value={editedProduct.descripcion || ""}
            onChange={(e) => setEditedProduct({ ...editedProduct, descripcion: e.target.value })}
            className="mt-1 border rounded px-2 py-1 w-full"
            rows={3}
          />
        ) : (
          <div className="text-sm mt-1 p-2 bg-muted/50 rounded">
            {product.descripcion || "No description available"}
          </div>
        )}
      </div>
    </div>
  );
}
