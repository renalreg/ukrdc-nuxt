# COMPONENTS

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

## Top-level components

### Paginator.vue

A reusable component for paginated lists. Provides props and events for navigating through a list.

### SearchBar.vue

A reusable search bar component. Provides props and events for binding search strings and handling submissions.
