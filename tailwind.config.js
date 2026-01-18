/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        roboto: ['var(--font-roboto)'],
        'system-ios': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'system-android': ['Roboto', 'Noto Sans', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'caption-ios': ['0.75rem', { lineHeight: '1.2' }],
        'footnote-ios': ['0.8125rem', { lineHeight: '1.2' }],
        'subheadline-ios': ['0.875rem', { lineHeight: '1.2' }],
        'callout-ios': ['0.9375rem', { lineHeight: '1.2' }],
        'body-ios': ['1rem', { lineHeight: '1.4' }],
        'headline-ios': ['1.0625rem', { lineHeight: '1.2' }],
        'title-1-ios': ['1.25rem', { lineHeight: '1.2' }],
        'title-2-ios': ['1.5rem', { lineHeight: '1.2' }],
        'title-3-ios': ['1.75rem', { lineHeight: '1.2' }],
        'large-title-ios': ['2rem', { lineHeight: '1.2' }],
        'caption-android': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.033em' }],
        'body-android': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.017em' }],
        'subtitle-android': ['0.875rem', { lineHeight: '1.57', letterSpacing: '0.007em' }],
        'button-android': ['0.875rem', { lineHeight: '1.75', letterSpacing: '0.089em' }],
        'overline-android': ['0.875rem', { lineHeight: '1.33', letterSpacing: '0.143em' }],
        'h6-android': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.007em' }],
        'h5-android': ['1.5rem', { lineHeight: '1.33', letterSpacing: '0' }],
        'h4-android': ['2.125rem', { lineHeight: '1.17', letterSpacing: '0.007em' }],
        'h3-android': ['2.625rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'h2-android': ['3rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'h1-android': ['3.375rem', { lineHeight: '1.2', letterSpacing: '0' }],
      },
      boxShadow: {
        'surface-elevated': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'surface-2': '0 2px 4px rgba(0, 0, 0, 0.12)',
        'surface-3': '0 4px 6px rgba(0, 0, 0, 0.16)',
        'surface-4': '0 8px 10px rgba(0, 0, 0, 0.19)',
        'surface-6': '0 12px 16px rgba(0, 0, 0, 0.24)',
      },
      backgroundColor: {
        'surface-elevated': '#ffffff',
        'surface-1': '#f5f5f5',
        'surface-2': '#eeeeee',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // === ADDED/MODIFIED FOR GEM RENDERING ===
      borderWidth: {
        '12': '12px',
        '16': '16px',
        '20': '20px',
      },
      animation: {
        'sparkle': 'sparkle 1.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 1s',
        'float-slow': 'float 4s ease-in-out infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'spin-slow': 'spin 3s linear infinite', // Added for gem rotation
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        spin: { // Added for the gem's rotation
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      // =======================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      opacity: {
        '25': '0.25',
      },
      backgroundOpacity: {
        '25': '0.25',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.slate.600'),
            h1: {
              color: theme('colors.slate.900'),
              fontWeight: '700',
              fontSize: theme('fontSize.3xl')[0],
              lineHeight: theme('lineHeight.tight'),
              marginBottom: theme('spacing.6'),
            },
            h2: {
              color: theme('colors.slate.800'),
              fontWeight: '600',
              fontSize: theme('fontSize.2xl')[0],
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
            },
            h3: {
              color: theme('colors.slate.800'),
              fontWeight: '600',
              fontSize: theme('fontSize.xl')[0],
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.3'),
            },
            p: {
              lineHeight: theme('lineHeight.relaxed'),
              marginBottom: theme('spacing.4'),
            },
            a: {
              color: theme('colors.indigo.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.indigo.700'),
                textDecoration: 'underline',
              },
            },
            strong: {
              color: theme('colors.slate.800'),
              fontWeight: '600',
            },
            em: {
              fontStyle: 'italic',
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: theme('spacing.6'),
              marginBottom: theme('spacing.4'),
              li: {
                marginBottom: theme('spacing.2'),
                paddingLeft: theme('spacing.1'),
              },
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: theme('spacing.6'),
              marginBottom: theme('spacing.4'),
              li: {
                marginBottom: theme('spacing.2'),
                paddingLeft: theme('spacing.1'),
              },
            },
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.indigo.300'),
              backgroundColor: theme('colors.indigo.50'),
              paddingLeft: theme('spacing.4'),
              paddingRight: theme('spacing.4'),
              paddingTop: theme('spacing.3'),
              paddingBottom: theme('spacing.3'),
              fontStyle: 'italic',
              color: theme('colors.slate.700'),
              marginBottom: theme('spacing.6'),
            },
            code: {
              backgroundColor: theme('colors.slate.100'),
              color: theme('colors.slate.800'),
              fontWeight: '500',
              fontSize: theme('fontSize.sm')[0],
              padding: '0.2em 0.4em',
              borderRadius: theme('borderRadius.md'),
            },
            pre: {
              backgroundColor: theme('colors.slate.900'),
              color: theme('colors.slate.100'),
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.lg'),
              overflow: 'auto',
              marginBottom: theme('spacing.6'),
              code: {
                backgroundColor: 'transparent',
                color: 'inherit',
                padding: '0',
                borderRadius: '0',
              },
            },
            table: {
              width: '100%',
              marginBottom: theme('spacing.6'),
              borderCollapse: 'collapse',
              th: {
                backgroundColor: theme('colors.slate.50'),
                padding: theme('spacing.3'),
                borderBottomWidth: '2px',
                borderColor: theme('colors.slate.200'),
                textAlign: 'left',
                fontWeight: '600',
                color: theme('colors.slate.800'),
              },
              td: {
                padding: theme('spacing.3'),
                borderBottomWidth: '1px',
                borderColor: theme('colors.slate.200'),
              },
            },
          },
        },
        lg: {
          css: {
            fontSize: theme('fontSize.lg')[0],
            lineHeight: theme('lineHeight.relaxed'),
            h1: {
              fontSize: theme('fontSize.4xl')[0],
            },
            h2: {
              fontSize: theme('fontSize.3xl')[0],
            },
            h3: {
              fontSize: theme('fontSize.2xl')[0],
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};