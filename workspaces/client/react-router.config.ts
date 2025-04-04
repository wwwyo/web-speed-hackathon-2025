import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'src',
  future: {
    unstable_viteEnvironmentApi: true,
  },
  ssr: true,
} satisfies Config;
