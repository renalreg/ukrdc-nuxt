# ukrdc-nuxt

## Developer Installation

### Prerequisites

- Create a `.env` file, for example:

```
OAUTH_ISSUER=https://renalregistry.okta.com/oauth2/ausn7fa9zfh1DC2La5d6
APP_CLIENT_ID=0oan98slw3m4mnhxq5d6
APP_BASE=/new/app
```

- Ensure a local UKRDC-FastAPI instance is running locally (see <https://github.com/renalreg/ukrdc-fastapi>)

### Installation

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Developer notes

### (No) Server-side rendering

One often cited advantage to using Nuxt over Vue is server-side rendering. However, we don't use it in this project.
SSR offers no significant advantage to us, since we don't care about SEO, and disabling it massively simplifies the code.
This is because Nuxt modules/plugins need to support both client and server-side rendering.

Take, for example, authentication. Okta offer a really nice JS library to simplify authentication with their service, however making this library compatible with SSR would be a huge amount of work. This is why Nuxt modules like nuxt-auth exist. Authentication states need to be passed to the server, for example as cookies, so that the server can then send API requests as the user, render the content, and send the rendered page back to the client.

Enabling SSR would essentially limit us to using libraries that have been converted into universal Nuxt modules, and in the case of nuxt-auth (for example), this caused more problems than it solved.

Instead, we disable SSR entirely, and make use of the wealth of client-side JS libraries throughout our code.
Removing our reliance on Nuxt modules is an ongoing process, but has already been useful.

Although we disable server-side rendering and build a "traditional" Vue single-page application, we make use of the internal Nuxt server to allow runtime configuration of the application. The Nuxt server essentially populates the SPA with runtime variables before serving it unrendered to the client, just like a normal Vue application.

### Authentication flow

Our authentication code is split over 3 main files:

#### `plugins/okta-auth.client.ts`

This plugin provides the bare minimum required to boostrap our authentication flow. It creates an instance of `OktaAuth` from the excellent `@okta/okta-auth-js` library, and injects this object as `$okta` into the application context and Vue instance. It additionally starts the Oktra authentication background service responsible for automatic token refreshing, and sets up functionality for restoring URLs after login callback using the Nuxt router.

#### `middleware/okta-auth.ts`

This router middleware provides auth-guard functionality, and is used to ensure that the user is authenticated before accessing any route. If the user is not authenticated, it records the current URL in the session, and redirects the user to the login page.

The auth-guard can be disabled on a page by adding `auth: false` to the page's component, see `pages/login.vue` for example.

#### `helpers/useAuth.ts`

This "use" module provides a simple way to access authentication functionality from within the application. It is essentially a composition API "mixin" providing Vue data refs and functions to simplify interaction with the `$okta` object.

### UKRDC API

We automatically handle adding authentication headers to UKRDC API requests by making all API requests from a custom Axios instance, created in `plugins/axios-ukrdc-api.client.ts`. This custom instance is injected into the application context and Vue instance as `$api`.

As well as adding authentication headers, `$api` also ensures that all API calls include the correct base path and API hostname.

An additional plugin `plugins/axios-error-handlers.ts` adds error handling to the `$api` instance.

### Upcoming Nuxt 3 changes

Once Nuxt 3 has launched and is stable, we will begin migration from Nuxt 2 to Nuxt 3. We will need to wait for a couple of Nuxt modules to confirm compatibility (or remove our dependence on them), but otherwise the transition should be fairly straightforward.

Thanks to [Headless UI](https://headlessui.dev/) and [@heroicons/vue](https://www.npmjs.com/package/@heroicons/vue) we can replace a lot of our custom components with pre-built components from those libraries, significantly reducing the amount of code we need to maintain.

#### Nuxt3 migration todo

It may be simpler to start a fresh Nuxt 3 project and add the application back in bits at a time until we have a fully working project.

- Phase 1: Migrate to [Nuxt Bridge](https://v3.nuxtjs.org/getting-started/bridge/)
  - Wait for nuxtjs/sentry module to support Nuxt 3/Bridge (or replace with normal Sentry Vue integration)
    - See https://github.com/nuxt-community/sentry-module/issues/358
  - Wait for `ssr: false` support in Bridge
    - See https://github.com/nuxt/framework/issues/886
  - Migrate to using Nuxt Bridge
    - See https://github.com/renalreg/ukrdc-nuxt/tree/bridge
- Phase 2: Migrate to [Nuxt 3](https://v3.nuxtjs.org/guide/getting-started/)
  - Wait for nuxtjs/axios module to support Nuxt 3 (or replace with normal Axios and a custom plugin)
    - See https://github.com/nuxt-community/axios-module/issues/536
  - Replace Tailwind module with "normal" Tailwind
    - See https://github.com/nuxt-community/tailwindcss-module/issues/387
  - Update requirements to Vue 3 compatible versions
    - `v-calendar` to `v-calendar@next`
    - `v-tooltip` to `v-tooltip@vue3`
  - Update Vue 3 comptible dependency initialisation
    - `vuex-persistedstate`
      - See https://github.com/robinvdvleuten/vuex-persistedstate/releases/tag/v4.0.0-beta.1

### Framework rationale

#### Vue

**As opposed to React, Angular, et al.** The choice was really between React and Vue. Vue was chosen primarily because of it's slightly lower barrier-to-entry for new contributors, and because of prior experience with the framework. Either would work fine.

#### Nuxt

**As opposed to "basic" Vue.** Nuxt is a framework based on Vue which provides a couple of useful things. Firstly, it enables partial server-side rendering, which on it's own isn't super useful for us, however it makes working with runtime configurations much simpler. This is useful as we move towards generalsed containers for deployment. On top of this, it provides a nice "all-in-one" solution without needing a separate server application.

Additionally, the Nuxt ecosystem has some really nice plugins such as the Nuxt-Auth plugin we use here. This greatly simplifies security implementations, making it easier to add a good authentication/authorisation layer.

Lastly, the built-in router helps further reduce the barrier-to-entry, using a filesystem based router which should be familiar to anyone who has worked with simple HTML websites previously.

#### Tailwind CSS

**As opposed to Bootstrap, UIKit, et al.** [This article by the libraries author says everything I could include here.](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)

### Build ARCHITECTURE.md

- Install `pipx`
- `pipx install archmd`
- `archmd . --out "ARCHITECTURE.md" --title="UKRDC-Nuxt Architecture"`
