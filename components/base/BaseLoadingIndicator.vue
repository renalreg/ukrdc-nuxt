<template>
  <div class="spinner">
    <div class="bounce1" :class="[`spinner-${colour}`]"></div>
    <div class="bounce2" :class="[`spinner-${colour}`]"></div>
    <div class="bounce3" :class="[`spinner-${colour}`]"></div>
  </div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    colour: {
      type: String,
      default: "indigo",
    },
  },
  setup() {},
});
</script>

<style lang="postcss" scoped>
.spinner-white {
  @apply bg-white;
}

.spinner-indigo {
  @apply bg-indigo-700;
}

.spinner-green {
  @apply bg-green-500;
}

.spinner-yellow {
  @apply bg-yellow-500;
}

.spinner-red {
  @apply bg-red-600;
}

.spinner {
  margin: 0 auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
