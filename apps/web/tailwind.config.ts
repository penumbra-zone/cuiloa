/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)"],
        body: ["var(--font-poppins)"],
        display: ["var(--font-work-sans)"],
        mono: ["var(--font-iosevka-mono)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        link: "hsl(var(--link))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        // NOTE: It may turn out that defining a set of these combined with media selectors might be a better
        // way to prevent certain effects:
        // - background moves too much because of gradient effect shifting with page height
        // - background is mostly white, no actual shades of accent
        // That said, some experimenting yielded a gradient that works surprisingly well on short and extremely long pages alike and
        // both across a range of viewports (4K 32" desktop and IPhone SE).
        // The background gradient is two repeating-radial gradients.
        // The first is for the most notable "halo" seen on the landing page. Its first colorlist ensures
        // a white inner gradient and uses a fixed 300px to keep the size restrained on longer pages.
        // The second gradient is mostly observable on longer pages, i.e. it ensures that there are rings and hues of purple further down.
        // hsla(176, 36%, 50%, 0.2)
        "gradient-repeat-radial": `repeating-radial-gradient(
            circle at left 40% bottom 10%,
            hsla(0 0% 100% / 0.3) 0 300px,
            hsl(176 36% 50% / 0.2) 45% 50%,
            transparent 70% 90%,
            hsl(176 36% 50% / 0.2) 95% 98%,
            transparent 100%
          ),
          repeating-radial-gradient(
            circle at left top,
            transparent 0% 40%,
            hsl(176 36% 50% / 0.2) 50% 60%,
            transparent 70% 80%,
            hsl(176 36% 50% / 0.2) 95% 98%,
            transparent 100%
          )`,
        // If medial selectors + gradients are revisited, using a single gradient for a stable purple halo on the first viewport span seems like a
        // like a good default where additional gradients are added for longer pages.
        // "gradient-repeat-radial": `
        //   radial-gradient(circle at left 40% bottom 1%, hsla(0 0% 100% / 1.0) 0% 40%, hsla(176 36% 50% / 0.2) 50% 55%, transparent 60% 100%)
        // `,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
