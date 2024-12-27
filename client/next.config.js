module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5.35.91.130",
      },
      {
        protocol: process.env.NEXT_PUBLIC_SERVER_IMG_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_IMG_DOMAIN,
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};
