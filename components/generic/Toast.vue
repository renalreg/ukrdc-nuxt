<template>
  <div ref="toastRootElement" class="w-full max-w-sm">
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transform ease-in duration-100"
      leave-class="opacity-100 sm:translate-x-0 translate-y-0"
      leave-to-class="opacity-0 sm:translate-x-1 translate-y-1 sm:translate-y-0"
    >
      <div
        v-if="active && primary === undefined"
        :class="classToastAll"
        class="pointer-events-auto relative mb-4 overflow-hidden rounded-lg shadow-lg"
      >
        <div
          v-if="progress && timeout"
          :class="classTimeout"
          class="absolute left-0 bottom-0 right-0 h-1 rounded"
          :style="progressStyle"
        ></div>
        <div class="shadow-xs z-100 overflow-hidden rounded-lg">
          <div class="p-4">
            <div class="flex items-start">
              <toastIcon class="flex-shrink-0" :type="type" :icon="icon" />
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p v-if="title" :class="classTitle" class="font-medium leading-5">
                  {{ title }}
                </p>
                <p :class="[classMessage, { 'mt-1': title }]" class="leading-5">
                  {{ message }}
                </p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  class="inline-flex text-gray-400 transition duration-150 ease-in-out focus:text-gray-500 focus:outline-none"
                  @click="destroy"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    :class="classClose"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="active && primary !== undefined && secondary !== undefined"
        :class="classToastAll"
        class="pointer-events-auto mb-4 w-full max-w-md rounded-lg shadow-lg"
      >
        <div
          v-if="progress && timeout"
          class="absolute left-0 bottom-0 right-0 h-1 rounded bg-gray-100"
          :style="progressStyle"
        ></div>
        <div class="shadow-xs flex rounded-lg">
          <div class="flex w-0 flex-1 items-center p-4">
            <toastIcon class="mr-4 flex-shrink-0" :type="type" :icon="icon" />
            <div class="w-full">
              <p v-if="title" :class="classTitle" class="font-medium leading-5">
                {{ title }}
              </p>
              <p :class="[classMessage, { 'mt-1': title }]" class="leading-5">
                {{ message }}
              </p>
            </div>
          </div>
          <div class="flex border-l border-gray-200">
            <div class="-ml-px flex flex-col">
              <div class="flex h-0 flex-1 border-b border-gray-200">
                <button
                  class="focus:shadow-outline-blue -mb-px flex w-full items-center justify-center rounded-tr-lg border border-transparent px-4 py-3 font-medium leading-5 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:border-blue-300 focus:outline-none active:bg-gray-50 active:text-indigo-700"
                  @click="primaryAction"
                >
                  {{ primary.label }}
                </button>
              </div>
              <div class="-mt-px flex h-0 flex-1">
                <button
                  class="focus:shadow-outline-blue flex w-full items-center justify-center rounded-br-lg border border-transparent px-4 py-3 font-medium leading-5 text-gray-700 transition duration-150 ease-in-out hover:text-gray-500 focus:border-blue-300 focus:outline-none active:bg-gray-50 active:text-gray-800"
                  @click="secondaryAction"
                >
                  {{ secondary.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="active && primary !== undefined && secondary === undefined"
        :class="classToastAll"
        class="pointer-events-auto mb-4 w-full max-w-md rounded-lg shadow-lg"
      >
        <div
          v-if="progress && timeout"
          class="absolute left-0 bottom-0 right-0 h-1 rounded bg-gray-100"
          :style="progressStyle"
        ></div>
        <div class="shadow-xs overflow-hidden rounded-lg">
          <div class="p-4">
            <div class="flex items-center">
              <toastIcon class="mr-4 flex-shrink-0" :type="type" :icon="icon" />
              <div class="flex w-0 flex-1 justify-between">
                <p class="w-0 flex-1 leading-5">{{ message }}</p>
                <button
                  class="ml-3 flex-shrink-0 font-medium leading-5 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none"
                  @click="primaryAction"
                >
                  {{ primary.label }}
                </button>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  class="inline-flex text-gray-400 transition duration-150 ease-in-out focus:text-gray-500 focus:outline-none"
                  @click="destroy"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    :class="classClose"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "@nuxtjs/composition-api";
import { removeElement } from "@/helpers/utils/domUtils";

interface Action {
  label: string;
  action(): void;
}

export default defineComponent({
  props: {
    title: {
      type: [Boolean, String],
      required: false,
      default: false,
    },
    message: {
      type: String,
      required: false,
      default: "Please specify a <b>message</b>",
    },
    type: {
      type: String,
      required: false,
      validate: (type: string) => {
        return ["success", "info", "danger", "warning", "denied"].includes(type);
      },
      default: "",
    },
    progress: {
      type: Boolean,
      required: false,
      default: true,
    },
    icon: {
      type: String,
      required: false,
      default: undefined,
    },
    timeout: {
      type: Number,
      required: false,
      default: 2,
    },
    primary: {
      type: Object as () => Action,
      required: false,
      default: undefined,
    },
    secondary: {
      type: Object as () => Action,
      required: false,
      default: undefined,
    },
    classToast: {
      type: String,
      required: false,
      default: "bg-white border border-gray-300",
    },
    classTitle: {
      type: String,
      required: false,
      default: "text-gray-900",
    },
    classMessage: {
      type: String,
      required: false,
      default: "text-gray-500",
    },
    classClose: {
      type: String,
      required: false,
      default: "text-gray-400",
    },
    classTimeout: {
      type: String,
      required: false,
      default: "bg-gray-200",
    },
    defaults: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  setup(props) {
    const toastRootElement = ref();

    const active = ref(false);
    const interval = ref();
    const timeLeft = ref();
    const speed = ref(100);

    const classToastAll = computed(() => {
      if (props.defaults && props.defaults.classToast) {
        return [props.classToast, props.defaults.classToast];
      }
      if (props.classToast) return [props.classToast];
      return [];
    });

    const timeLeftPercent = computed(() => {
      if (!props.timeout) {
        return 0;
      }
      return Math.round((((timeLeft.value * 100) / (props.timeout * 1000)) * 100) / 100);
    });

    const progressStyle = computed(() => {
      return `width: ${timeLeftPercent.value}%; transition: width 0.1s linear;`;
    });

    function updateTime() {
      timeLeft.value -= speed.value;
      if (timeLeft.value === 0) {
        destroy();
      }
    }

    function destroy() {
      active.value = false;
      clearInterval(interval.value);
      setTimeout(() => {
        destroy();
        removeElement(toastRootElement.value);
      }, 1000);
    }

    function primaryAction() {
      props.primary.action();
      destroy();
    }

    function secondaryAction() {
      props.secondary.action();
      destroy();
    }

    onMounted(() => {
      active.value = true;
      if (props.timeout > 0) {
        timeLeft.value = props.timeout * 1000;
        interval.value = setInterval(() => updateTime(), speed.value);
      }
    });

    return {
      toastRootElement,
      active,
      interval,
      timeLeft,
      speed,
      classToastAll,
      timeLeftPercent,
      progressStyle,
      destroy,
      primaryAction,
      secondaryAction,
    };
  },
});
</script>
