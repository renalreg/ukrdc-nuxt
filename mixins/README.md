# MIXINS

This directory contains some Vue mixins providing functions common to many components.

## Composition API 'use' modules

As we migrate to the composition API, this folder will become only populated by modules beginning with the `use` prefix. These function kind of like abstract base classes to provide foundations for components to build on.

For example, `usePagination` creates basic functionality for pages that use URL query-based pagination.
