const { withSettingsGradle } = require('@expo/config-plugins');

module.exports = function withReactSettingsPluginFix(config) {
  return withSettingsGradle(config, (config) => {
    if (config.modResults.contents.includes('reactNativeMinor == 74 && reactNativePatch <= 3')) {
      config.modResults.contents = config.modResults.contents.replace(
        /reactNativeMinor == 74 && reactNativePatch <= 3/g,
        'reactNativeMinor == 74'
      );
    }
    return config;
  });
};
