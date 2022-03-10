import { OktaAuth, OktaAuthOptions } from "@okta/okta-auth-js";
import * as VueRouter from "vue-router";

declare class NuxtOktaAuth extends OktaAuth {
  router: VueRouter.default;
  constructor(options: OktaAuthOptions, router: VueRouter.default);
  signInAuto(originalUri?: string): Promise<void>;
  signOutAuto(): Promise<void>;
}

interface NuxtOktaAuthOptions extends OktaAuthOptions {
  namespace?: string;
  defaultProtectRoutes?: boolean; // Protect routes by default. If false, page "auth: true" must be explicitly set on each route.
  authExpiredRedirectUri?: string; // Router URI to redirect to when auth state changes to expired
}

declare module "@nuxt/vue-app" {
  interface Context {
    $okta: NuxtOktaAuth;
  }
  interface NuxtAppOptions {
    $okta: NuxtOktaAuth;
  }
}

// Nuxt 2.9+
declare module "@nuxt/types" {
  interface Context {
    $okta: NuxtOktaAuth;
  }

  interface NuxtAppOptions {
    $okta: NuxtOktaAuth;
  }

  interface Configuration {
    okta?: NuxtOktaAuthOptions;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $okta: NuxtOktaAuth;
  }
}
