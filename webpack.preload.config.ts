import type { Configuration } from 'webpack';
import { join } from 'path';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const preloadConfig: Configuration = {
  target: 'electron-preload',
  entry: './src/preload.ts',
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    fallback: {
      fs: false,
      os: false,
      path: false,
    },
  },
  output: {
    path: join(__dirname, '.webpack'),
    filename: 'preload.js',
  },
};
