// @babel/preset-env will automatically determine which Babel plugins are needed
// based on the target environments specified in the configuration.
// https://babeljs.io/docs/en/babel-preset-env

export default function (api) {
  // Cache the configuration
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = api.env('test');
  
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: isTest ? { node: 'current' } : 'defaults',
        modules: isTest ? 'commonjs' : 'auto',
        useBuiltIns: 'usage',
        corejs: 3,
        debug: false,
      },
    ],
  ];

  const plugins = [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      corejs: 3,
    }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ];

  // Add test-specific plugins
  if (isTest) {
    plugins.push('@babel/plugin-transform-modules-commonjs');
  }

  return {
    presets,
    plugins,
    sourceMaps: 'inline',
    retainLines: true,
    ignore: [
      'node_modules',
      'dist',
    ],
  };
};
