<!-- 
Description list grid item component, which should contain TextDt and TextDd elements.
We use this component to control column spanning of individual dt/dd pairs within a dl grid.
Allowed under the spec, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl#wrapping_name-value_groups_in_div_elements
-->

<template>
  <div class="sm:col-span-1">
    <slot></slot>
  </div>
</template>
