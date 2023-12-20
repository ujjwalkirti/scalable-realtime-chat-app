import "./globals.css";
import type { Metadata } from "next";
import {  Montserrat } from "next/font/google";
import { SocketProvider } from "../context/SocketProvider";

const monsterrat = Montserrat({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "GroupC - Group chats, video calls and voice calls like never before!",
  description: "Presenting to you, brand new application for your group to stay alive, awake and connected!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <SocketProvider>
        <body className={monsterrat.className}>{children}</body>
      </SocketProvider>
    </html>
  );
}
