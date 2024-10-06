import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ChatWithPDF",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <Providers>
                <html lang="en">
                    <head>
                        <link
                            rel="icon"
                            href="/icon.ico"
                            type="image/x-icon"
                        />
                    </head>
                    <body className={inter.className}>{children}</body>
                </html>
            </Providers>
        </ClerkProvider>
    );
}
