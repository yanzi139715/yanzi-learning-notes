import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "学习笔记 · 妍子",
    template: "%s · 妍子的学习笔记",
  },
  description: "和 AI 干活时学到的东西，核对过才写下来。",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500&family=Noto+Sans+SC:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap"
        />
      </head>
      <body>
        <div aria-hidden className="orb" style={{ width: 120, height: 120, left: "12%", top: "22%" }} />
        <div aria-hidden className="orb lilac" style={{ width: 150, height: 150, right: "16%", top: "12%" }} />
        <div aria-hidden className="orb blue" style={{ width: 80, height: 80, right: "9%", top: "52%" }} />
        <div aria-hidden className="orb" style={{ width: 50, height: 50, left: "20%", top: "80%" }} />
        <header className="topnav">
          <Link className="brand" href="/">
            <span className="zh">妍子</span>
            <span className="en">yanzi.life</span>
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
