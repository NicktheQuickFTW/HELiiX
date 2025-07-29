// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = 'https://heliix.big12sports.com';

// Import and set font for each variant
import { Geist } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';

const primaryFont = Geist({
  variable: '--font-primary',
  subsets: ['latin'],
  display: 'swap',
});

const monoFont = Geist_Mono({
  variable: '--font-code',
  subsets: ['latin'],
  display: 'swap',
});

const font = {
  primary: primaryFont,
  secondary: primaryFont,
  tertiary: primaryFont,
  code: monoFont,
};

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: 'dark', // dark | light
  neutral: 'gray', // sand | gray | slate
  brand: 'blue', // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: 'indigo', // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: 'contrast', // color | contrast
  solidStyle: 'flat', // flat | plastic
  border: 'playful', // rounded | playful | conservative
  surface: 'translucent', // filled | translucent
  transition: 'all', // all | micro | macro
  scaling: '100', // 90 | 95 | 100 | 105 | 110
};

const dataStyle = {
  variant: 'gradient', // flat | gradient | outline
  mode: 'categorical', // categorical | divergent | sequential
  height: 24, // default chart height
  axis: {
    stroke: 'var(--neutral-alpha-weak)',
  },
  tick: {
    fill: 'var(--neutral-on-background-weak)',
    fontSize: 11,
    line: false,
  },
};

const effects = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: true,
    x: 50,
    y: -25,
    width: 100,
    height: 100,
    tilt: 0,
    colorStart: 'accent-background-strong',
    colorEnd: 'static-transparent',
    opacity: 50,
  },
  dots: {
    display: true,
    size: 2,
    color: 'brand-on-background-weak',
    opacity: 20,
  },
  lines: {
    display: false,
    color: 'neutral-alpha-weak',
    opacity: 100,
  },
  grid: {
    display: true,
    color: 'neutral-alpha-weak',
    opacity: 100,
    width: 'var(--static-space-32)',
    height: 'var(--static-space-32)',
  },
};

// metadata for pages
const meta = {
  home: {
    path: '/',
    title: 'HELiiX - Big 12 Operations Platform',
    description:
      'Comprehensive operations platform for Big 12 Conference athletics management, awards tracking, and administrative operations.',
    image: '/images/og/home.jpg',
    canonical: 'https://heliix.big12sports.com',
    robots: 'index,follow',
    alternates: [{ href: 'https://heliix.big12sports.com', hrefLang: 'en' }],
  },
  // add more routes and reference them in page.tsx
};

// default schema data
const schema = {
  logo: '',
  type: 'Organization',
  name: 'HELiiX - Big 12 Conference',
  description: meta.home.description,
  email: 'operations@big12sports.com',
};

// social links
const social = {
  twitter: 'https://www.twitter.com/Big12Conference',
  linkedin: 'https://www.linkedin.com/company/big-12-conference/',
  website: 'https://big12sports.com',
};

// routes configuration for navigation
const routes = {
  '/': true,
  '/dashboard': true,
  '/overview': true,
  '/operations': true,
  '/awards': true,
  '/contacts': true,
  '/manuals': true,
  '/championships': true,
  '/teams': true,
  '/finance': true,
  '/sports': true,
  '/analytics': true,
  '/ai-assistant': true,
  '/ai-features': true,
  '/travel': true,
  '/weather': true,
  '/sync': true,
  '/settings': true,
  '/profile': true,
  '/help': true,
};

export {
  baseURL,
  font,
  style,
  meta,
  schema,
  social,
  effects,
  dataStyle,
  routes,
};
