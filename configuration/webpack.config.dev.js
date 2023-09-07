const path = require('path')
const environment = require('./environment')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const environment = require('./environment')

module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: environment.paths.output
    },
    client: {
      overlay: {
        errors: true,
        runtimeErrors: false,
        warnings: false,
      }
    },
    historyApiFallback: false,
    open: true,
    compress: true,
    hot: true,
    allowedHosts: [
      environment.settings.basicRemoteHost,
      // publicdomain.com
    ],
    ...environment.server,
  },
  stats: {
    errorDetails: true
  },
  entry: {
    index: path.resolve(environment.paths.source, 'index.js')
  },
  output: {
    path: environment.paths.output,
    filename: `${environment.settings.outputFilename}.js`,
    clean: true
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(c|sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              url: {
                filter: (url, _resourcePath) => {
                  if (!environment.settings.disableCheckForRelativePaths) {
                    return url
                  }
                  // Disable processing for root-relative urls under /images
                  // return !/^\/images\//.test(url)

                  // This would disable processing for all root-relative urls:
                  return !/^\//.test(url)
                },
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.json$/,
        type: 'asset/resource',
        generator: {
          filename: 'data/[hash].json'
        }
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|webp)$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          }
        },
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.fonts,
          }
        },
        generator: {
          filename: 'assets/fonts/[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${environment.settings.outputFilename}.css`
    })
  ]
}