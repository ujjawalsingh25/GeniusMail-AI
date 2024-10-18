// Since root file named with '_'underscoreStarting so inside files are taken as Routes even named page.tsx
// ____________________________________________________________________________________________________________

import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
})

export const Logo = () => {
    return(
        <div className="flex flex-col items-center">
            <div>
                <Image 
                    src= "/GeniusMail-AI_logo.svg"
                    alt= "RealStream"
                    height= "225"
                    width= "225"
                />
            </div>
            <div className={cn(
                "flex flex-col items-center",
                font.className,
            )}>
                <p className="text-xl text-white font-semibold mb-4">
                    Let AI Simplify Your Inbox
                </p>
            </div>
        </div>
    );
};