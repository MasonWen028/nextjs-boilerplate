'use client';

import { useState, useEffect } from "react";
import AuthButton from "../auth-button";
import './index.css';

const NAV = ["Home","About","Features","Pricing","Try It"] as const;

export default function Navbar({ active: initialActive = "About" }: { active?: typeof NAV[number] }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<typeof NAV[number]>(initialActive);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);

      // 检测当前可见的section
      const sections = NAV.map(name => ({
        name,
        element: document.getElementById(name.toLowerCase().replaceAll(" ", "-"))
      })).filter(s => s.element);

      // 找到当前在视口中的section
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          // 如果section的顶部在视口上半部分
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };
    
    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`top-0 z-40 font-sen transition-colors duration-300 navbar-area ${
      scrolled ? "sticky" : ""
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center gap-8">
          {/* 左侧 Logo 区：图标 + 粗黑文字 */}
          <a href="#home" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/fenricwithtext.png"
              alt="OzBridge CRM Logo"
              className="h-8"
            />
            <span className="text-xl font-extrabold leading-none tracking-tight text-slate-900 whitespace-nowrap">
              OzBridge CRM
            </span>
          </a>

          {/* 中间菜单 - 占据剩余空间并居中 */}
          <nav className="hidden lg:flex items-center justify-center gap-10 text-[15px] leading-none flex-1">
            {NAV.map((name) => {
              const isActive = activeSection === name;
              return (
                <a
                  key={name}
                  href={`#${name.toLowerCase().replaceAll(" ", "-")}`}
                  className={[
                    "transition-colors whitespace-nowrap",
                    isActive
                      ? "text-slate-900 font-bold"
                      : "text-slate-400 font-normal hover:text-slate-700",
                  ].join(" ")}
                >
                  {name}
                </a>
              );
            })}
          </nav>

          {/* 右侧认证按钮 */}
          <div className="flex-shrink-0">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
