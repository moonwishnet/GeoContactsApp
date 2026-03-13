const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 解决 crypto 模块问题
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
  };

  // 忽略 react-native-maps 和 react-native-amap3d 在 Web 环境下的问题
  config.module.rules.push({
    test: /(react-native-maps|react-native-amap3d)/,
    use: 'null-loader',
  });

  // 配置 CSP 头部，允许高德地图相关资源
  if (config.devServer) {
    config.devServer.headers = {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://webapi.amap.com https://restapi.amap.com https://jsapi.amap.com blob:",
        "style-src 'self' 'unsafe-inline' https://webapi.amap.com",
        "img-src 'self' data: https://webapi.amap.com https://restapi.amap.com https://vdata.amap.com https://*.amap.com https://api.dicebear.com",
        "connect-src 'self' https://webapi.amap.com https://restapi.amap.com https://jsapi.amap.com https://*.amap.com",
        "worker-src 'self' blob:",
        "font-src 'self' data:",
        "frame-src 'self'",
      ].join('; '),
    };
  }

  return config;
};
