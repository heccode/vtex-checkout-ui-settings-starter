const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const environment = require('./environment')

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(environment.paths.source, 'index.js')
  },
  output: {
    path: environment.paths.output,
    filename: `${environment.settings.outputFilename}.js`,
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
  ],
  optimization: {
    minimizer: [
      new JsonMinimizerPlugin(),
      new TerserPlugin()
    ]
  }
}
