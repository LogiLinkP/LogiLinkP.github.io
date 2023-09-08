import { commonEnv } from "./environment.common";

const env: Partial<typeof commonEnv> = {
    url_back: 'http://localhost:3000',
    url_back_chat: 'http://localhost:5000/chat',
    url_front: 'http://localhost:4200'
};

export const environment = Object.assign(commonEnv, env);