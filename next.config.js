const withMdxEnhanced = require("next-mdx-enhanced");
const rehypePrism = require("@mapbox/rehype-prism");
const emoji = require('remark-emoji');
const breaks = require('remark-breaks');

module.exports = withMdxEnhanced({
  layoutPath: "src/layouts",
  defaultLayout: true,
  remarkPlugins: [breaks, emoji],
  rehypePlugins: [rehypePrism],
})({
  pageExtensions: ["mdx", "tsx"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          type: "json",
          use: "yaml-loader",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
        },
      ]
    );
    return config;
  },
});
