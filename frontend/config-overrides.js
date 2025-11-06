const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config) {
  config.plugins.push(new MonacoWebpackPlugin({
    languages: ['javascript', 'typescript', 'html', 'css', 'json']
  }));

  config.ignoreWarnings = [
    (warning) =>
      warning.module &&
      warning.module.resource.includes('monaco-editor') &&
      warning.details &&
      warning.details.includes('source-map-loader'),
  ];

  return config;
};
