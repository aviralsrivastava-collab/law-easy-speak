import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "trust-blue": {
          DEFAULT: "hsl(var(--trust-blue))",
          light: "hsl(var(--trust-blue-light))",
          lighter: "hsl(var(--trust-blue-lighter))",
        },
        "safe-green": {
          DEFAULT: "hsl(var(--safe-green))",
          foreground: "hsl(var(--safe-green-foreground))",
        },
        "warm-amber": {
          DEFAULT: "hsl(var(--warm-amber))",
          foreground: "hsl(var(--warm-amber-foreground))",
        },
        "cat-family": { DEFAULT: "hsl(var(--cat-family))", foreground: "hsl(var(--cat-family-foreground))" },
        "cat-criminal": { DEFAULT: "hsl(var(--cat-criminal))", foreground: "hsl(var(--cat-criminal-foreground))" },
        "cat-labour": { DEFAULT: "hsl(var(--cat-labour))", foreground: "hsl(var(--cat-labour-foreground))" },
        "cat-property": { DEFAULT: "hsl(var(--cat-property))", foreground: "hsl(var(--cat-property-foreground))" },
        "cat-consumer": { DEFAULT: "hsl(var(--cat-consumer))", foreground: "hsl(var(--cat-consumer-foreground))" },
        "cat-cyber": { DEFAULT: "hsl(var(--cat-cyber))", foreground: "hsl(var(--cat-cyber-foreground))" },
        "cat-government": { DEFAULT: "hsl(var(--cat-government))", foreground: "hsl(var(--cat-government-foreground))" },
        "cat-women": { DEFAULT: "hsl(var(--cat-women))", foreground: "hsl(var(--cat-women-foreground))" },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.55" },
          "50%": { transform: "translate3d(20px,-20px,0) scale(1.15)", opacity: "0.85" },
        },
        "typing-dot": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "40%": { transform: "translateY(-4px)", opacity: "1" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 14s ease-in-out infinite",
        "glow-drift-slow": "glow-drift 12s ease-in-out infinite",
        "glow-drift-med": "glow-drift 9s ease-in-out infinite",
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
        "caret-blink": "caret-blink 1s steps(2,start) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
