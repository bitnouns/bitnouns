import React from 'react'
import Footer from './Footer'
import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-around bg-skin-backdrop text-skin-base">
      <div className="flex max-w-[1400px] flex-col items-center justify-around">
        <Header />
        <div className="relative z-20 min-h-screen w-full bg-skin-backdrop p-6 sm:mt-8 lg:px-12 xl:px-24">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
