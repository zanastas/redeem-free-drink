import Image from "next/image";
import { Indie_Flower } from "next/font/google";
const indie = Indie_Flower({ subsets: ["latin"], weight: ["400"] });

export default function RedeemedPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-between p-6 sm:p-8 pb-footer">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col items-center">
        <div className="pt-6 pb-4 text-center h-32 flex flex-col justify-center">
          <h1 className={`text-3xl font-bold font-thick ${indie.className}`}>Enjoy your free drink!</h1>
        </div>

        <div className="my-10 w-48 h-48 rounded-full overflow-hidden flex items-center justify-center">
          <video 
            src="/coffee-logo.mp4" 
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover"
            aria-label="Coffee cup"
          />
        </div>

        <div className="text-center">
          <p className="text-xl font-semibold">Redeemed!</p>
        </div>
        
        <footer className="w-full max-w-sm mx-auto mt-32 pb-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image src="/webe-cafe-logo.jpg" alt="webe cafe logo" width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>Vibe coded by AI Fusion Labs</span>
          <Image src="/aifusionlabs-logo.png" alt="AI Fusion Labs logo" width={30} height={30} />
        </div>
        </footer>
      </div>
    </main>
  );
}


