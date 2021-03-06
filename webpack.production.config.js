'use strict';

let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: path.join(__dirname, 'app/main.jsx'),
	output: {
		path: path.join(__dirname, '/dist/'),
		filename: 'client-[hash].min.js',
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new HtmlWebpackPlugin({
			template: 'app/index.tpl.html',
			inject: 'body',
			filename: 'index.html',
		}),
		new ExtractTextPlugin('[name]-[hash].min.css'),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true,
			},
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		})
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					"presets": [
						"es2015",
						"stage-0",
						"react",
					],
				}
			}, {
				test: /\.json?$/,
				loader: 'json',
			}, {
				test: /\.scss$/,
				loaders: [
					'style',
					'css',
					'sass',
				],
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss!sass')
			}, {
				test: /\.jpe?g$/,
				loader: 'file',
			},
		],
	},
	postcss: [
		require('autoprefixer'),
	],
	resolve: {
		extensions: [
			'',
			'.js',
			'.jsx',
		],
		modulesDirectories: [
			'node_modules',
			'./app',
		],
	},
	node: {
		fs: "empty",
	},
};
