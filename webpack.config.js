const path = require('path');


module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'electron/scripts/react'),
		filename: "main.js"
	},
	module: {
		rules: [
		  {
		    test: /\.jsx?$/,
		    exclude: /node_modules/,
		    use: {
				loader: 'babel-loader'
		    }
		  },
		  {
		    test: /\.css$/,
		    use: ['style-loader', 'css-loader']
		  }
		],
	}
};

