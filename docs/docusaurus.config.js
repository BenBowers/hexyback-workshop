// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  markdown: {
    mermaid: true,
  },
  title: "I'm bringing Hexy Back",
  tagline: "Those other frameworks don't know how to act",
  url: 'https://benbowers.github.io',
  baseUrl: '/hexyback-workshop/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'BenBowers', // Usually your GitHub org/user name.
  projectName: 'hexy-back-workshop', // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          docLayoutComponent: '@theme/DocPage',
          docItemComponent: '@theme/ApiItem', // Derived from docusaurus-theme-openapi
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/hexy-back.png',
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: "I'm Bringin' Hexy Back",
        logo: {
          alt: 'Hexy Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Workshop',
          },
          {
            label: 'Hexy API',
            position: 'left',
            to: '/docs/category/hexy-api',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Workshop',
                to: '/docs/intro',
              },
              {
                label: 'Hexy API',
                to: '/docs/category/hexy-api',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/journey-one/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} I'm Bringin' Hexy Back - Workshop.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['ruby', 'csharp', 'php'],
      },
    }),

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        docsPluginId: 'classic',
        config: {
          hexy: {
            specPath: 'node_modules/@hexy/backend/openapi/spec.json',
            outputDir: 'docs/hexy',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
          },
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs', '@docusaurus/theme-mermaid'],
};

module.exports = config;
