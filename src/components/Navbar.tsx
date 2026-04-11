import { useState } from "react";
import { Scale, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Scale className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold text-foreground">LexiLearn</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#mapper" className="hover:text-foreground transition-colors">Offense Mapper</a>
          <a href="#topics" className="hover:text-foreground transition-colors">Topics</a>
          <a href="#rights" className="hover:text-foreground transition-colors">Know Your Rights</a>
          <a href="#aid" className="hover:text-foreground transition-colors">Legal Aid</a>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Globe className="w-4 h-4" /> EN
          </Button>
          <Button variant="hero" size="sm">Get Help Now</Button>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4 space-y-3">
          <a href="#mapper" className="block py-2 text-foreground font-medium">Offense Mapper</a>
          <a href="#topics" className="block py-2 text-foreground font-medium">Topics</a>
          <a href="#rights" className="block py-2 text-foreground font-medium">Know Your Rights</a>
          <a href="#aid" className="block py-2 text-foreground font-medium">Legal Aid</a>
          <Button variant="hero" className="w-full">Get Help Now</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
