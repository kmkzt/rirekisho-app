/* eslint-disable no-undef */
const { resolve } = require('path')
const withCSS = require('@zeit/next-css')
const CopyPlugin = require('copy-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = withCSS({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      },
    })

    config.plugins = config.plugins || []
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: [
          'html',
          'css',
          'markdown',
          //   'json',
          //   'typescript',
          //   'javascript',
          //   'graphql',
          //   'python',
          //   'scss',
          //   'yaml',
        ],
        filename: 'static/[name].worker.js',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolve(
              __dirname,
              'node_modules/pdfjs-dist/build/pdf.worker.min.js'
            ),
            to: resolve(__dirname, 'public'),
          },
        ],
      }),
      new WriteFilePlugin()
    )
    return config
  },
})
