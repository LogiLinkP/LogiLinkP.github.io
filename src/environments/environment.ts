import { commonEnv } from "./environment.common";

const env: Partial<typeof commonEnv> = {
  url_back: 'https://logilink.hopto.org:3000',
  url_back_chat: 'https://logilink.hopto.org:5000',
  url_front: 'https://logilink.hopto.org',
};

// Export all settings of common replaced by dev options
export const environment = Object.assign(commonEnv, env);