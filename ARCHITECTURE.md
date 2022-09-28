# UKRDC-Nuxt Architecture

  - [composables](#composables)
    - [composables/query](#composables-query)
  - [layouts](#layouts)
  - [dist](#dist)
  - [assets](#assets)
  - [plugins](#plugins)
  - [helpers](#helpers)
  - [store](#store)
  - [interfaces](#interfaces)
  - [components](#components)
    - [components/transition](#components-transition)
    - [components/icons](#components-icons)
    - [components/base](#components-base)
    - [components/plots](#components-plots)
  - [middleware](#middleware)
  - [static](#static)
  - [pages](#pages)

<a name="composables"></a>

## COMPOSABLES

Vue composables using the composition API to encapsulate and reuse stateful logic.

More information about the usage of composables in [the Vue.js documentation](https://vuejs.org/guide/reusability/composables.html#conventions-and-best-practices).

<a name="composables-query"></a>

### QUERY

Functions related to getting, setting, and parsing client URL query parameters.

<a name="layouts"></a>

## LAYOUTS

This directory contains your Application Layouts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/views#layouts).

<a name="dist"></a>

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

<a name="plugins"></a>

## PLUGINS

This directory contains Javascript plugins that you want to run before mounting the root Vue.js application.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/plugins).

<a name="helpers"></a>

## HELPERS

Helper functions used in multiple components, or abstracted in order to minimize in-component logic and dependencies.

<a name="store"></a>

## STORE

This directory contains your Vuex Store files.
Vuex Store option is implemented in the Nuxt.js framework.

Creating a file in this directory automatically activates the option in the framework.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/vuex-store).

<a name="interfaces"></a>

## INTERFACES

This directory contains our TypeScript interfaces used in multiple pages or components.

<a name="components"></a>

## COMPONENTS

The components directory contains our Vue.js Components.

<a name="components-transition"></a>

### components/transitions

The icons components directory contains all reusable transition/animation components.

<a name="components-icons"></a>

### components/icons

The icons components directory contains all reusable icon components.

Our primary icon pack is [heroicons](https://heroicons.com/). They have a Vue component library however as it only supports Vue 3, we need to re-implement any icons we want to use.

When adding a new icon, ensure you follow the structure and naming scheme of the official Vue 3 library, see [https://github.com/tailwindlabs/heroicons#vue](https://github.com/tailwindlabs/heroicons#vue).

<a name="components-base"></a>

### components/base

The base components directory contains all generic reusable components that are not tied to any particular application domain. This includes things like buttons, form elements, and highly generic UI elements.

<a name="components-plots"></a>

### components/plots

The icons components directory contains all reusable plotly components.

<a name="middleware"></a>

## MIDDLEWARE

This directory contains your application middleware.
Middleware let you define custom functions that can be run before rendering either a page or a group of pages.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/routing#middleware).

<a name="static"></a>

## STATIC

This directory contains your static files.
Each file inside this directory is mapped to `/`.
Thus you'd want to delete this README.md before deploying to production.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/assets#static).

<a name="pages"></a>

## PAGES

This directory contains your Application Views and Routes.
The framework reads all the `*.vue` files inside this directory and creates the router of your application.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/routing).
