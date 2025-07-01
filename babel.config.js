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
        targets: {
          node: 'current',
        },
        modules: 'auto',
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ];

  const plugins = [
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-transform-modules-commonjs', { loose: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ];

  const env = {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
            modules: 'commonjs',
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: false,
            version: '^7.22.5',
          },
        ],
      ],
    },
  };
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
