# UKRDC-Nuxt Architecture

- [middleware](#middleware)
- [schemes](#schemes)
- [mixins](#mixins)
- [plugins](#plugins)
- [utilities](#utilities)
- [components](#components)
  - [components/masterrecords](#components-masterrecords)
  - [components/workitems](#components-workitems)
  - [components/navigation](#components-navigation)
  - [components/profile](#components-profile)
  - [components/dash](#components-dash)
  - [components/generic](#components-generic)
- [layouts](#layouts)
- [static](#static)
- [assets](#assets)
- [pages](#pages)
- [interfaces](#interfaces)
- [store](#store)

<a name="middleware"></a>

## MIDDLEWARE

**This directory is not required, you can delete it if you don't want to use it.**

This directory contains your application middleware.
Middleware let you define custom functions that can be run before rendering either a page or a group of pages.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/routing#middleware).

<a name="schemes"></a>

## SCHEMES

This directory contains Javascript plugins defining custom authentication schemes for `nuxt-auth`.

Currently used to enable runtime config of the Auth module

<a name="mixins"></a>

## MIXINS

Technically not mixins in the Vue 2 Options API sense.

Modules beginning with the `use` prefix, used by the composition API to augment component functionality. These function kind of like abstract base classes to provide foundations for components to build on.

For example, `usePagination` creates basic functionality for pages that use URL query-based pagination.

<a name="plugins"></a>

## PLUGINS

**This directory is not required, you can delete it if you don't want to use it.**

This directory contains Javascript plugins that you want to run before mounting the root Vue.js application.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/plugins).

<a name="utilities"></a>

## UTILITIES

This directory contains Javascript functions that are not bound to Vue components. For example, frequently-used functions for data parsing.

<a name="components"></a>

## COMPONENTS

The components directory contains your Vue.js Components.

_Nuxt.js doesn't supercharge these components._

Nuxt is set to auto-import components found here. Subdirectories determine the component's imported name, e.g.

```none
components/
  base/
      foo/
         Button.vue
```

will be auto-imported as `<BaseFooButton />`

<a name="components-masterrecords"></a>

### MASTERRECORDS

This folder contains components used in the master record viewer. Specifically, components unique to the master record list (i.e. excluding generic components used in the masterrecords view, such as the search bar).

<a name="components-workitems"></a>

### WORKITEMS

This folder contains components used in the workitems viewer. Specifically, components unique to the workitems list (i.e. excluding generic components used in the workitems view, such as the pagination footer).

<a name="components-navigation"></a>

### NAVIGATION

Contains reusable components related to site navitgation, such as the meu sidebar.

<a name="components-profile"></a>

### PROFILE

Contains reusable components related to the user profile, such as the profile badge seen in the sidebar (or header on mobile).

<a name="components-dash"></a>

### DASH

This folder contains components used in the application dashboard.

<a name="components-generic"></a>

### GENERIC

Contains generic reusable components, pre-styled, and with working Vue interactivity.

<a name="layouts"></a>

## LAYOUTS

This directory contains your Application Layouts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/views#layouts).

<a name="static"></a>

## STATIC

This directory contains your static files.
Each file inside this directory is mapped to `/`.
Thus you'd want to delete this README.md before deploying to production.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/assets#static).

<a name="assets"></a>

## ASSETS

This directory contains your un-compiled assets such as LESS, SASS, or JavaScript.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/assets#webpacked).

<a name="pages"></a>

## PAGES

This directory contains your Application Views and Routes.
The framework reads all the `*.vue` files inside this directory and creates the router of your application.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/routing).

<a name="interfaces"></a>

## INTERFACES

This directory contains our TypeScript interfaces used in multiple pages or components.

<a name="store"></a>

## STORE

**This directory is not required, you can delete it if you don't want to use it.**

This directory contains your Vuex Store files.
Vuex Store option is implemented in the Nuxt.js framework.

Creating a file in this directory automatically activates the option in the framework.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/vuex-store).
