export default function ContactPage() {
  return (
    <div className="bg-white min-h-[60vh] px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-sm text-gray-700">
          Have questions about this Amazon clone project? Reach out using the
          details below.
        </p>
        <div className="border border-gray-200 rounded-md p-4 shadow-sm space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Email:</span> support@example.com
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Hours:</span> Mon–Fri, 9:00–17:00
          </p>
        </div>
        <p className="text-xs text-gray-500">
          This is a demo application. No real customer support is provided.
        </p>
      </div>
    </div>
  );
}

