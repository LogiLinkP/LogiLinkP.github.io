import { commonEnv } from "./environment.common";

const env: Partial<typeof commonEnv> = {
    
  };

// Export all settings of common replaced by dev options
export const environment = Object.assign(commonEnv, env);