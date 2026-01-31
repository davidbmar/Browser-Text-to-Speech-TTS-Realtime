import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, BookOpen, Zap, Github } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Demo", icon: Mic },
    { href: "/docs", label: "Documentation", icon: BookOpen },
    { href: "/quickstart", label: "Quick Start", icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">Browser TTS</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                  data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          <a
            href="https://github.com/rhasspy/piper"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
          >
            <Button variant="outline" size="icon" data-testid="link-github">
              <Github className="w-4 h-4" />
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
}
