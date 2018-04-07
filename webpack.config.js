const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		publicPath: path.join( __dirname, 'src', 'public' )
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.(png|jp(e*)g|svg)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 8000, // Convert images < 8kb to base64 strings
						name: 'images/[hash]-[name].[ext]'
					}
				}]
			},
			{
				test:/\.(s*)css$/,
				use:['style-loader','css-loader', 'sass-loader']
			}
		]
	},
	node: {
		fs: 'empty'
	}
};