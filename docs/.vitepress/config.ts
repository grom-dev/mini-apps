import type { DefaultTheme } from 'vitepress'
import process from 'node:process'
import { defineConfig } from 'vitepress'

const guideSidebar: Array<DefaultTheme.SidebarItem> = [
  {
    text: 'Introduction',
    items: [
      { text: 'Getting Started', link: '/guide/getting-started' },
    ],
  },
]

const featuresSidebar: Array<DefaultTheme.SidebarItem> = [
  { text: 'Overview', link: '/features/overview' },
  {
    text: 'Core',
    items: [
      { text: 'Launch Parameters', link: '/features/launch-params' },
      { text: 'WebView Bridge', link: '/features/bridge' },
    ],
  },
  {
    text: 'Essentials',
    items: [
      { text: 'Lifecycle', link: '/features/lifecycle' },
      { text: 'Closing Behavior', link: '/features/closing-behavior' },
      { text: 'Swipes Behavior', link: '/features/swipes-behavior' },
      { text: 'Orientation Behavior', link: '/features/orientation-behavior' },
      { text: 'Links', link: '/features/links' },
    ],
  },
  {
    text: 'Interface',
    items: [
      { text: 'Theming', link: '/features/theming' },
      { text: 'Viewport', link: '/features/viewport' },
      { text: 'Fullscreen', link: '/features/fullscreen' },
      { text: 'Bottom Buttons', link: '/features/bottom-buttons' },
      { text: 'Back Button', link: '/features/back-button' },
      { text: 'Settings Button', link: '/features/settings-button' },
      { text: 'Popup', link: '/features/popup' },
      { text: 'Loading Screen', link: '/features/loading-screen' },
    ],
  },
  {
    text: 'Device',
    items: [
      { text: 'Haptic', link: '/features/haptic' },
      { text: 'Biometrics', link: '/features/biometrics' },
      { text: 'Geolocation', link: '/features/geolocation' },
      { text: 'Motion Tracking', link: '/features/motion-tracking' },
      { text: 'QR Scanner', link: '/features/qr-scanner' },
      { text: 'File Downloads', link: '/features/file-downloads' },
      { text: 'Virtual Keyboard', link: '/features/virtual-keyboard' },
      { text: 'Clipboard', link: '/features/clipboard' },
      { text: 'Home Screen', link: '/features/home-screen' },
      { text: 'Hardware Information', link: '/features/hardware-info' },
    ],
  },
  {
    text: 'Telegram',
    items: [
      { text: 'Payments', link: '/features/payments' },
      { text: 'Permissions', link: '/features/permissions' },
      { text: 'Media Sharing', link: '/features/media-sharing' },
      { text: 'Data Sending', link: '/features/data-sending' },
      { text: 'Inline Query', link: '/features/inline-query' },
      { text: 'Emoji Status', link: '/features/emoji-status' },
    ],
  },
  {
    text: 'Storage',
    items: [
      { text: 'Cloud Storage', link: '/features/cloud-storage' },
      { text: 'Device Storage', link: '/features/device-storage' },
      { text: 'Secure Storage', link: '/features/secure-storage' },
    ],
  },
]

export default defineConfig({
  title: 'Grom Mini Apps',
  description: 'Modern SDK for crafting Telegram Mini Apps.',
  base: process.env.BASE_URL || '/',
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Features', link: '/features/overview' },
      {
        text: 'Telegram',
        items: [
          { text: 'Guide to Mini Apps', link: 'https://core.telegram.org/bots/webapps' },
          { text: 'API • Mini Apps on Telegram', link: 'https://core.telegram.org/api/bots/webapps' },
          { text: 'API • Web events', link: 'https://core.telegram.org/api/web-events' },
        ],
      },
    ],
    sidebar: {
      guide: { items: guideSidebar },
      features: { items: featuresSidebar },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/grom-dev/mini-apps' },
    ],
    editLink: {
      pattern: 'https://github.com/grom-dev/mini-apps/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
