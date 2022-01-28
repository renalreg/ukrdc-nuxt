# HELPERS

Helper functions used in multiple components, or abstracted in order to minimize in-component logic and dependencies.

Modules beginning with the `use` or `fetch` prefixes are used by the composition API to augment component functionality.
These function kind of like abstract base classes to provide foundations for components to build on.

For example, `usePagination` creates basic functionality for pages that use URL query-based pagination.
