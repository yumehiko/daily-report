import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.module\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader', options: { modules: true } },
  ],
});
rules.push({
  test: /\.css$/,
  exclude: /\.module\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
