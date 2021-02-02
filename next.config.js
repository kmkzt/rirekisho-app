/* eslint-disable no-undef */
const { resolve } = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = {
  webpack: (config) => {
    config.plugins = config.plugins || []
    config.plugins.push(
      new CopyPlugin(
        {
          patterns: [
            {
              from: resolve(
                __dirname,
                'node_modules/pdfjs-dist/build/pdf.worker.min.js'
              ),
              to: resolve(__dirname, 'public'),
            },
          ],
        },
        new WriteFilePlugin()
      )
    )

    return config
  },
}
