import { createNextConfig } from '@web3insight/next-config';

export default createNextConfig({
  overrides: {
    typescript: { ignoreBuildErrors: true },
    async redirects() {
      return [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'dev.web3insight.ai' }],
          destination: 'https://web3insight.ai/:path*',
          statusCode: 301,
        },
      ];
    },
  },
});
