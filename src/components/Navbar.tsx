import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, Menu, X, Globe, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Scale className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold text-foreground">LexiLearn</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="/#mapper" className="hover:text-foreground transition-colors">Offense Mapper</a>
          <a href="/#topics" className="hover:text-foreground transition-colors">Topics</a>
          <a href="/#rights" className="hover:text-foreground transition-colors">Know Your Rights</a>
          <a href="/#aid" className="hover:text-foreground transition-colors">Legal Aid</a>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/dashboard")}>
                <User className="w-4 h-4" /> Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
              <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4 space-y-3">
          <a href="/#mapper" className="block py-2 text-foreground font-medium">Offense Mapper</a>
          <a href="/#topics" className="block py-2 text-foreground font-medium">Topics</a>
          <a href="/#rights" className="block py-2 text-foreground font-medium">Know Your Rights</a>
          <a href="/#aid" className="block py-2 text-foreground font-medium">Legal Aid</a>
          {user ? (
            <>
              <Button variant="ghost" className="w-full justify-start gap-1" onClick={() => { navigate("/dashboard"); setIsOpen(false); }}>
                <User className="w-4 h-4" /> Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-1 text-muted-foreground" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button variant="hero" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
              Sign In / Sign Up
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
