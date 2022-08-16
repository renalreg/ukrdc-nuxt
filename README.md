# ukrdc-nuxt

## Developer Installation

### Prerequisites

- Create a `.env` file (see below):
- Ensure a local UKRDC-FastAPI instance is running locally (see <https://github.com/renalreg/ukrdc-fastapi>)

### Installation

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Environment variables

### Build-time

- `GITHUB_REF` - GitHub ref for automatic error reporting
- `GITHUB_SHA` - GitHub SHA for automatic error reporting
- `SENTRY_DSN` - Sentry DSN for automatic error reporting
- `SENTRY_AUTH_TOKEN` - Sentry auth token
- `SENTRY_ORG` - Sentry organization name
- `SENTRY_PROJECT` - Sentry project name

### Run-time

- `API_HOST` - UKRDC API host. Defaults to null, which means same host will be used. Useful for local development.
- `API_PROTOCOL` - UKRDC API protocol. Defaults to https. Useful for local development.
- `MANAGE_ACCOUNT_URL` - Okta account management URL. Defaults to https://renalregistry.okta.com/app/UserHome.
- `DEPLOYMENT_ENV` - Deployment environment,used for system and error reporting. Defaults to 'development'.
- `OAUTH_ISSUER` - Okta OAuth issuer
- `APP_CLIENT_ID` - Okta OAuth client ID

## Developer notes

### Application and API versioning

The application version will generally follow the version of the API it is compatible with. Therefore, the application should follow [semantic versioning](https://semver.org/) for the API functionality, that is:

- Major version changes should be accompanied by a breaking change in the API.
- Minor version changes should be accompanied by a non-breaking change in the API.
- Patch version changes should be accompanied by fixes or updates introducing no new API functionality.

Under this system, the major and minor application versions should be the same as the API client version, and the patch version should iterate on it's own with any changes not dependent on API functionality.

[Use Yarn to set the application version.](https://classic.yarnpkg.com/en/docs/cli/version) (Note: This will automatically create a git commit, so after running this command, you should push the changes to the remote repository.)

### Github Release Versions

Github releases should use tags that follow the application version. E.g. application version 1.0.1 will be tagged with `v1.0.1`.

This will publish a container image tagged with the version number, and `latest` (except pre-release versions e.g. `1.0.1-beta.1`).

## ESLint and Prettier

ESLint and Prettier should be handled separately.

To check your code without changing anything, run:

```
yarn eslint:check
yarn prettier:check
```

To fix the issues, run:

```
yarn eslint:fix
yarn prettier:fix
```

### (No) Server-side rendering

One often cited advantage to using Nuxt over Vue is server-side rendering. However, we don't use it in this project.
SSR offers no significant advantage to us, since we don't care about SEO, and disabling it massively simplifies the code.
This is because Nuxt modules/plugins need to support both client and server-side rendering.

Take, for example, authentication. Okta offer a really nice JS library to simplify authentication with their service, however making this library compatible with SSR would be a huge amount of work. This is why Nuxt modules like nuxt-auth exist. Authentication states need to be passed to the server, for example as cookies, so that the server can then send API requests as the user, render the content, and send the rendered page back to the client.

Enabling SSR would essentially limit us to using libraries that have been converted into universal Nuxt modules, and in the case of nuxt-auth (for example), this caused more problems than it solved.

Instead, we disable SSR entirely, and make use of the wealth of client-side JS libraries throughout our code.
Removing our reliance on Nuxt modules is an ongoing process, but has already been useful.

Although we disable server-side rendering and build a "traditional" Vue single-page application, we make use of the internal Nuxt server to allow runtime configuration of the application. The Nuxt server essentially populates the SPA with runtime variables before serving it unrendered to the client, just like a normal Vue application.

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
  - In progress: https://github.com/renalreg/ukrdc-nuxt/pull/157
- Phase 2: Migrate to [Nuxt 3](https://v3.nuxtjs.org/guide/getting-started/)
  - **Requires Sentry module compatibility update**
  - Replace/remove @nuxt/postcss8
    - See https://tailwindcss.com/docs/guides/nuxtjs and https://stackoverflow.com/questions/70302520/nuxtjs-v3-and-tailwindcss-v3-postcss8-not-compatible
  - Update requirements to Vue 3 compatible versions
    - `v-calendar` to `v-calendar@next`
    - `v-tooltip` to `v-tooltip@vue3`

### Framework rationale

#### Vue

**As opposed to React, Angular, et al.** The choice was really between React and Vue. Vue was chosen primarily because of it's slightly lower barrier-to-entry for new contributors, and because of prior experience with the framework. Either would work fine.

#### Nuxt

**As opposed to "basic" Vue.** Nuxt is a framework based on Vue which provides a couple of useful things. Firstly, it enables partial server-side rendering, which on it's own isn't super useful for us, however it makes working with runtime configurations much simpler. This is useful as we move towards generalsed containers for deployment. On top of this, it provides a nice "all-in-one" solution without needing a separate server application.

Additionally, the built-in router helps further reduce the barrier-to-entry, using a filesystem based router which should be familiar to anyone who has worked with simple HTML websites previously.

#### Tailwind CSS

**As opposed to Bootstrap, UIKit, et al.** [This article by the libraries author says everything I could include here.](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)

### Build ARCHITECTURE.md

- Install `pipx`
- `pipx install archmd`
- `archmd . --out "ARCHITECTURE.md" --title="UKRDC-Nuxt Architecture"`
