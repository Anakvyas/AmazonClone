export default function AppLoading() {
  return (
    <div className="space-y-10 px-4 py-6 md:px-8">
      <div className="h-[220px] w-full animate-pulse rounded-3xl bg-gray-200 md:h-[320px]" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 animate-pulse rounded-full bg-gray-100" />
              <div className="h-10 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
