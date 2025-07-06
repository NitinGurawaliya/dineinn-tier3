import nextPwa from 'next-pwa'

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com'],
  },
}

// Wrap config with PWA plugin
const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev, // Disable SW in development
})

export default withPWA(baseConfig)
