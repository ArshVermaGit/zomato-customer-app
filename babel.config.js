module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-export-namespace-from',
      [
        'module-resolver',
        {
          alias: {
            'react-native-worklets': 'react-native-worklets-core',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
