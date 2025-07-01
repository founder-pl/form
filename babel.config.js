const isTest = process.env.NODE_ENV === 'test';

export default {
  presets: [
    ['@babel/preset-env', {
      targets: isTest ? { node: 'current' } : '> 0.25%, not dead',
      modules: isTest ? 'commonjs' : false,
      useBuiltIns: 'usage',
      corejs: 3,
      shippedProposals: true,
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      useESModules: !isTest,
    }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  },
  ignore: [
    'node_modules',
    'dist',
  ],
};
