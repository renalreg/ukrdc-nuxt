/*
Injects a $toast object into the Vue instance and context,
allowing programatic toast creation.
*/

import Vue from "vue";
import { spawn } from "@/helpers/utils/domUtils";
import Toast from "~/components/generic/Toast.vue";

const containerClasses = [
  "z-40",
  "fixed",
  "inset-0",
  "flex",
  "flex-col-reverse",
  "items-end",
  "justify-center",
  "px-4",
  "py-6",
  "pointer-events-none",
  "sm:p-6",
  "sm:items-end",
  "sm:justify-end",
];

export const toastProgrammatic = {
  show(props: object | string): Vue {
    if (typeof props === "string") props = { message: props };
    return spawn("toasts", props, Toast, Vue);
  },
  success(message: string) {
    return spawn("toasts", { type: "success", message }, Toast, Vue);
  },
  info(message: string) {
    return spawn("toasts", { type: "info", message }, Toast, Vue);
  },
  danger(message: string) {
    return spawn("toasts", { type: "danger", message }, Toast, Vue);
  },
  warning(message: string) {
    return spawn("toasts", { type: "warning", message }, Toast, Vue);
  },
  denied(message: string) {
    return spawn("toasts", { type: "denied", message }, Toast, Vue);
  },
};

declare module "vue/types/vue" {
  interface Vue {
    $toast: typeof toastProgrammatic;
  }
}

declare module "@nuxt/types" {
  // nuxtContext.app.$toast inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $toast: typeof toastProgrammatic;
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $toast: typeof toastProgrammatic;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Create a div to hold created toasts
  const toasts = document.createElement("div");
  containerClasses.forEach((c) => toasts.classList.add(c));
  toasts.setAttribute("id", "toasts");
  document.body.appendChild(toasts);

  // Inject toastProgrammatic into Vue
  nuxtApp.provide("toast", toastProgrammatic);
});
