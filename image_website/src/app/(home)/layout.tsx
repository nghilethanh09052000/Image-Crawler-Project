import '../globals.css'
import NavBar from '@/components/Navbar/Navbar';
import { Inter } from 'next/font/google'
import { AppContextProvider } from '@/context/Context';
import CircleLoading from '@/components/CircleLoading/CircleLoading';
import ErrorModal from '@/components/ErrorModal.tsx/ErrorModal';

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
        <AppContextProvider>
          <NavBar/>
          <CircleLoading/>
          <ErrorModal/>
          {children}
        </AppContextProvider>
      </body>
    </html>
  )
}
