module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    process.env.NODE_ENV !== 'test' ? 'react-native-reanimated/plugin' : null,
  ].filter(Boolean),
};
