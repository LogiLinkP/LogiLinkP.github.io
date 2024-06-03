import { commonEnv } from "./environment.common";

const env: Partial<typeof commonEnv> = {
  url_back: 'http://165.227.94.126:3000',
  url_back_chat: 'http://165.227.94.126:5000',
  url_front: 'http://143.244.170.98',
};

// Export all settings of common replaced by dev options
export const environment = Object.assign(commonEnv, env);