import Vue from 'vue'
import { VClosePopover, VPopover, VTooltip } from 'v-tooltip'

Vue.directive('tooltip', VTooltip)
Vue.directive('close-popover', VClosePopover)
Vue.component('VPopover', VPopover)
