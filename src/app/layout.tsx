import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import DarkToggle from '@/components/ui/dark-toggle'
import DavidInit from '@/components/ui/david-init'

export const metadata: Metadata = {
  title: 'JSON Quizzinator',
  description: 'A quiz app that loads questions from JSON files.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <DavidInit />
        <div className="fixed top-4 right-4 z-50"> 
          <DarkToggle />
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
