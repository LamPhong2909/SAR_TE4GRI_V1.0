// postcss.config.js
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssAspectRatioPolyfill from 'postcss-aspect-ratio-polyfill';

export default {
  plugins: [
    postcssAspectRatioPolyfill,
    tailwindcss('./tailwind.config.js'),
    autoprefixer,
  ],
};