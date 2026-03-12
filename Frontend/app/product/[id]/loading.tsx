export default function ProductLoading() {
  return (
    <div className="min-h-[40vh] bg-[#f3f4f6] px-4 py-8 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[88px_minmax(0,0.9fr)_minmax(340px,1fr)]">
        <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 w-20 animate-pulse rounded-md border border-gray-200 bg-white"
            />
          ))}
        </div>

        <div className="order-1 rounded-2xl bg-[#ececec] p-4 lg:order-2 lg:p-6">
          <div className="mx-auto aspect-square max-w-lg animate-pulse rounded-2xl bg-white/70" />
        </div>

        <div className="order-3 space-y-5">
          <div className="space-y-3">
            <div className="h-12 w-4/5 animate-pulse rounded-xl bg-white" />
            <div className="h-8 w-56 animate-pulse rounded-xl bg-white" />
            <div className="h-10 w-72 animate-pulse rounded-xl bg-white" />
            <div className="h-8 w-80 animate-pulse rounded-xl bg-white" />
            <div className="h-8 w-72 animate-pulse rounded-xl bg-white" />
          </div>

          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-2xl bg-white" />
            <div className="h-20 animate-pulse rounded-2xl bg-white" />
            <div className="h-8 w-2/3 animate-pulse rounded-xl bg-white" />
            <div className="h-8 w-1/2 animate-pulse rounded-xl bg-white" />
            <div className="h-8 w-3/5 animate-pulse rounded-xl bg-white" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-16 animate-pulse rounded-2xl bg-white" />
            <div className="h-16 animate-pulse rounded-2xl bg-[#f7c767]" />
          </div>

          <div className="h-16 animate-pulse rounded-2xl bg-white" />
          <div className="h-40 animate-pulse rounded-2xl bg-[#ececec]" />
          <div className="h-24 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    </div>
  );
}
