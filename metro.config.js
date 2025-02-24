const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;
const defaultAssetExts =
  require('metro-config/src/defaults/defaults').assetExts;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: [...defaultSourceExts],
    assetExts: [...defaultAssetExts, 'obj','glb','mtl'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);