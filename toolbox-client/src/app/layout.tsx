import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import PageWrapper from "@/components/page-wrapper"
import Header from "@/components/header"
import StoreProvider from "@/components/StoreProvider"
import ThemeProvider from "@/components/ThemeProvider"
import Link from "next/link"
import kamvusoftLogo from "@/assets/kamvusoft.png"
import Image from "next/image"
import { Suspense } from "react"
import Loader from "@/components/Loader"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toolbox | Kamvusoft",
  description: "A set of utilities to simplify some basic tasks",
  keywords: [
    "Toolbox", "PDF Manipulation", "Split", "Merge", "Extract pages", "Remove pages", "Extract text from image", "Image OCR"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={
            <div className='w-full h-dvh flex justify-center items-center'>
                <Loader />
            </div>
        }>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen overflow-auto bg-white dark:bg-slate-800 dark:text-gray-300">
              <Header />
              <PageWrapper> 
                <StoreProvider> {children} </StoreProvider>  
              </PageWrapper>
              {/* footer */}
              <div className="flex flex-col items-center justify-center h-20 md:h-16 bg-slate-200 dark:bg-gray-900">
                <p className="text-xs text-gray-600 dark:text-gray-500 leading-none text-center pb-1 italic px-2 md:px-8">
                  You can have peace of mind that we won&apos;t keep your files or use them for any purpose. 
                  They are deleted from our servers when you finish.
                </p>
                <Link href="https://kamvusoft.com" className="flex items-center">
                  <Image 
                    alt="Kamvusoft"
                    src={kamvusoftLogo}
                    height={25}
                    width={25}
                    className="drop-shadow-md rounded"/>
                  <span className="ps-2 dark:text-gray-400">Powered by <span className="color-primary">Kamvusoft</span></span>
                </Link>
              </div>
            </div>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
