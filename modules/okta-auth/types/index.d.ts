import { OktaAuth } from "@okta/okta-auth-js";

interface oktaAuthOptions {
  redirectUri: string;
  postLogoutRedirectUri: string;
  responseType: string;
  pkce: boolean;

  issuer: string;
  clientId: string;
  scopes: string[];
}

declare module "@nuxt/vue-app" {
  interface Context {
    $okta: OktaAuth;
  }
  interface NuxtAppOptions {
    $okta: OktaAuth;
  }
}

// Nuxt 2.9+
declare module "@nuxt/types" {
  interface Context {
    $okta: OktaAuth;
  }

  interface NuxtAppOptions {
    $okta: OktaAuth;
  }

  interface Configuration {
    okta?: oktaAuthOptions;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $okta: OktaAuth;
  }
}
