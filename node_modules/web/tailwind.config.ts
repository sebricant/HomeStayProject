import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/**/*.{js,ts,jsx,tsx}", // Include shared UI
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0E4D64", // Deep Ocean Teal
                    light: "#136F8C",
                    dark: "#082F3D",
                },
                secondary: {
                    DEFAULT: "#5FA8D3", // Soft Aqua
                    light: "#82C0E2",
                    dark: "#3B86B2",
                },
                accent: {
                    coral: "#FF7F50", // Sunset Coral
                    gold: "#D4AF37", // Warm Gold
                },
                neutral: {
                    sand: "#F5F1E6", // Sand Beige background
                    coconut: "#FFFFFF", // Coconut White
                    driftwood: "#A99F96", // Muted text
                },
                surface: {
                    DEFAULT: "#FFFFFF",
                    hover: "#F8FAFC",
                    sand: "#F5F1E6",
                },
                status: {
                    success: "#588157", // Palm Green
                    error: "#E63946",   // Muted Red
                    warning: "#F4A261", // Sandy Orange
                },
                text: {
                    main: "#1F2937",
                    muted: "#64748B",
                    light: "#94A3B8",
                }
            },
            fontFamily: {
                heading: ["Playfair Display", "serif"],
                sans: ["Outfit", "sans-serif"],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'lift': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'ripple': 'ripple 1s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                ripple: {
                    '0%': { transform: 'scale(0.8)', opacity: '1' },
                    '100%': { transform: 'scale(2.4)', opacity: '0' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
