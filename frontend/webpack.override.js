// webpack.override.js
module.exports = function override(config, env) {
    // Ajouter une règle pour ignorer les warnings de source map
    config.ignoreWarnings = [
      {
        message: /Failed to parse source map/,
      },
    ];
    return config;
  };
  