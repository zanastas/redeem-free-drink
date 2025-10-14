export default function RedeemedPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-between p-6 sm:p-8">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col items-center">
        <div className="pt-6 pb-4 text-center">
          <h1 className="text-2xl font-semibold">Enjoy your free drink!</h1>
        </div>

        <div className="my-10 w-48 h-48 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <div className="w-28 h-28 bg-gray-400 rounded-md" aria-label="coffee-cup-filled-placeholder" />
        </div>

        <div className="mt-auto text-center">
          <p className="text-xl font-semibold">Redeemed!</p>
          <div className="mt-3 h-10 px-4 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
            Voucher code placeholder
          </div>
        </div>
      </div>

      <footer className="w-full max-w-sm mx-auto pb-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-300" />
          <span>webe cafe</span>
        </div>
        <span>Vibe coded by AI Fusion Labs</span>
      </footer>
    </main>
  );
}


