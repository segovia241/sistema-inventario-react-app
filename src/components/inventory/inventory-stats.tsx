
interface InventoryStatsProps {
  skuTotal: number
  stockIssues: number
}

export function InventoryStats({ skuTotal, stockIssues }: InventoryStatsProps) {
  return (
    <div className="w-64 bg-card border-l border-border p-6 space-y-6">
      {/* SKU Total */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">SKU Total</p>
        <p className="text-3xl font-bold">{skuTotal.toLocaleString()}</p>
      </div>
      {/* Stock Issues */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Stock Issues</p>
        <p className="text-3xl font-bold text-red-500">{stockIssues}</p>
      </div>
    </div>
  )
}
