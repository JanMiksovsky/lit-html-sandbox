const path = require('path');

module.exports = [{

  entry: './src/components/TestElement2.js',

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
        query: {
          presets: ['env']
        }
			}
    ]
  },

  output: {
    filename: 'demos.js',
    path: path.resolve(__dirname, 'build'),
    sourceMapFilename: 'demos.map'
  },
  
  devtool: 'source-map'

}];
