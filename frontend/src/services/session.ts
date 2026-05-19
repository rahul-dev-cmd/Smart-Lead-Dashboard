import type { User } from "../types";

const ACCESS_TOKEN_KEY = "smart_leads_access_token";
const USER_KEY = "smart_leads_user";

export const sessionStorageService = {
  readAccessToken: (): string | null => window.localStorage.getItem(ACCESS_TOKEN_KEY),

  readUser: (): User | null => {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  writeSession: (user: User, accessToken: string): void => {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  clearSession: (): void => {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
