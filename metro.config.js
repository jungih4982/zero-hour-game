const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Zustand 4 exposes an ESM entry containing `import.meta.env`. Metro leaves
// that syntax in the classic web bundle, which the generated non-module script
// cannot parse. Classic package resolution selects Zustand's compatible
// CommonJS entry for web and native builds.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
