export function DataTable({ data }: { data: any[] }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mx-4 lg:mx-6">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Recent Sales
        </h3>
        <p className="text-sm text-muted-foreground">
          You made 265 sales this month.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {data?.length ? (
            data.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Sample Item {index + 1}</p>
                  <p className="text-sm text-muted-foreground">sample@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
