import './globals.css';
export const metadata = { title: 'NewsForge Studio', description: 'Hybrid local and cloud news video assembly' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
