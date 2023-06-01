import { defineConfig } from 'dumi';

export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  title: 'react-flow-builder',
  favicon: './bytedance.ico',
  logo: './bytedance.ico',
  outputPath: 'docs-dist',
  publicPath: './',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
});
