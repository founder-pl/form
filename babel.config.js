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
        targets: isTest ? { node: 'current' } : '> 0.25%, not dead',
        modules: isTest ? 'commonjs' : 'auto',
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: !isTest,
        version: '^7.22.5',
      },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ];

  // Only add commonjs transform if not in test environment
  if (!isTest) {
    plugins.push(['@babel/plugin-transform-modules-commonjs', { loose: true }]);
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
