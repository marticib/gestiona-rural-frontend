export function ChartAreaInteractive() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Area Chart - Interactive
        </h3>
        <p className="text-sm text-muted-foreground">
          Showing total visitors for the last 6 months
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="h-[250px] w-full flex items-center justify-center bg-muted/50 rounded">
          <p className="text-muted-foreground">Chart will be implemented here</p>
        </div>
      </div>
    </div>
  )
}
