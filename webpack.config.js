'use strict';

let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'eval-source-map',
	entry: [
		'webpack-hot-middleware/client?reload=true',
		path.join(__dirname, 'app/main.jsx'),
	],
	output: {
		path: path.join(__dirname, '/dist/'),
		filename: '[name].js',
		publicPath: path.join(__dirname, 'app', 'public'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'app/index.tpl.html',
			inject: 'body',
			filename: 'index.html',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
	],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								"react",
								"env",
								"stage-0",
								"react-hmre",
							],
						},
					},
				],
			}, {
				test: /\.json$/,
				use: [
					{
						loader: "json-loader",
					},
				],
			}, {
				test: /\.css$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
						options: {
							modules: true,
							localIdentName: "[name]---[local]---[hash:base64:5]",
						},
					},
				],
			}, {
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
					},
					{
						loader: "sass-loader",
					}
				],
			}, {
				test: /\.jpe?g$/,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
		],
	},
	resolve: {
		extensions: [
			'.js',
			'.jsx',
		],
		modules: [
			'node_modules',
			'./app',
		],
	},
	node: {
		fs: "empty",
	},
};
