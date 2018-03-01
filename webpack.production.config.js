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
	postcss: [
		require('autoprefixer'),
	],
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
