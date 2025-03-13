import type {Metadata} from 'next'
import {Manrope} from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  variable: '--font-manrope',
  preload: true,
  subsets: ['cyrillic'],
})

export const metadata: Metadata = {
  title: 'HSE Design Likes Widget Generator',
  description: 'Create an embeddable likes widget for hsedesign.ru to highlight your portfolio and attract more attention.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>{children}</body>
    </html>
  )
}
