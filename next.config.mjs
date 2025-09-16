/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Allow loading WASM
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Handle Three.js modules properly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Handle web-ifc-three compatibility
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/web-ifc-three/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },
    });

    return config;
  },

  // ✅ WASM 정적 경로에 MIME 헤더 강제
  async headers() {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    return [
      {
        source: `${base}/wasm/:path*`,
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // (서브경로 배포 시 사용 – 필요 없으면 환경변수 비워두면 됨)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  transpilePackages: ['three', 'web-ifc-three'],
};

export default nextConfig;
