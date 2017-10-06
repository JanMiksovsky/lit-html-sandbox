const path = require('path');

module.exports = [{

  entry: './src/demos.js',

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
        query: {
          plugins: ['transform-object-assign'],
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
