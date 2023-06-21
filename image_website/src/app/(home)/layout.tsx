import '../globals.css'
import NavBar from '@/components/Navbar/Navbar';

import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Lumionix',
  description: 'Show all images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true} >
        <NavBar/>
        {children}
      </body>
    </html>
  )
}
