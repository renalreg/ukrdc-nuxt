# UKRDC-Nuxt Architecture

  * [MIDDLEWARE](#middleware)
  * [MIXINS](#mixins)
  * [PLUGINS](#plugins)
  * [COMPONENTS](#components)
    * [DASH](#components-dash)
  * [LAYOUTS](#layouts)
  * [STATIC](#static)
  * [ASSETS](#assets)
  * [PAGES](#pages)
  * [INTERFACES](#interfaces)
  * [STORE](#store)

<a name="middleware"></a>
## MIDDLEWARE

**This directory is not required, you can delete it if you don't want to use it.**

This directory contains your application middleware.
Middleware let you define custom functions that can be run before rendering either a page or a group of pages.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/routing#middleware).

<a name="mixins"></a>
## MIXINS

This directory contains some Vue mixins providing functions common to many components.

<a name="plugins"></a>
## PLUGINS

**This directory is not required, you can delete it if you don't want to use it.**

This directory contains Javascript plugins that you want to run before mounting the root Vue.js application.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/plugins).

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

<a name="components-dash"></a>
### DASH

This folder contains components used in the application dashboard.

<a name="layouts"></a>
## LAYOUTS

This directory contains your Application Layouts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/views#layouts).

<a name="static"></a>
## STATIC

**This directory is not required, you can delete it if you don't want to use it.**

This directory contains your static files.
Each file inside this directory is mapped to `/`.
Thus you'd want to delete this README.md before deploying to production.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/assets#static).

<a name="assets"></a>
## ASSETS

**This directory is not required, you can delete it if you don't want to use it.**

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
