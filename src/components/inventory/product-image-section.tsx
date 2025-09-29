import { useState } from "react"
import { Upload, ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImageSectionProps {
  imageUrl?: string
  productName: string
}

export function ProductImageSection({ imageUrl, productName }: ProductImageSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = imageUrl ? [imageUrl] : []

  return (
    <div className="mb-6">
      <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden mb-2">
        {imageUrl ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>1 of 3</span>
        <button
          type="button"
          className="flex items-center text-sm text-muted-foreground"
          onClick={() => console.log("Add image clicked")}
        >
          <Upload className="w-4 h-4 mr-2" />
          Add image
        </button>
      </div>
    </div>
  )
}
