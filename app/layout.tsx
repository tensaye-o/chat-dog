import { Cantarell as FontSans } from 'next/font/google'

import { cn } from '@/lib/utils'
import '@/styles/globals.css'

export const metadata = {
  title: 'Chat Dog',
  description: "Chat Dog based on OpenAI's GPT-5 model",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

const fontSans = FontSans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn('antialiased font-sans', fontSans.variable)}>
        {children}
      </body>
    </html>
  )
}
