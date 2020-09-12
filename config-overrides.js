/* config-overrides.js */

module.exports = function override(config, env) {
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };

  config.optimization.runtimeChunk = false;

  config.output.filename = "js/[name].js";

  return config;
};
