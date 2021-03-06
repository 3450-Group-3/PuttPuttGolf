import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
	mode: isDevelopment ? 'development' : 'production',
	entry: './client/index.tsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'app/static/js'),
	},
	devServer: {
		port: 8000,
		allowedHosts: 'all',
		hot: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean),
							presets: [
								['@babel/preset-react', { runtime: 'automatic' }],
								'@babel/preset-env',
								[
									'@babel/preset-typescript',
									{ isTSX: true, allExtensions: true },
								],
							],
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [new ReactRefreshWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	devtool: 'inline-source-map',
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
};

export default config;
