import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  contentDirBasePath: '/docs'
})

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true
  },

  reactStrictMode: true,
  transpilePackages: ['nextra'],
})
