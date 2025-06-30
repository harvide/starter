/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@repo/config',
              message: "Use '@repo/config/client' in client-side files.",
            },
            {
              name: '@repo/config/server',
              message: 'Only use in server modules.',
            },
          ],
        },
      ],
    },
  },
];
