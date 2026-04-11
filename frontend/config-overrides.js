module.exports = function override(config) {
  // Ignorer les source maps pour @mediapipe/tasks-vision
  config.module.rules = config.module.rules.map(rule => {
    if (rule.loader && rule.loader.includes('source-map-loader')) {
      return {
        ...rule,
        exclude: [/node_modules\/@mediapipe\/tasks-vision/]
      };
    }
    return rule;
  });

  // Gérer les fichiers .mjs
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};