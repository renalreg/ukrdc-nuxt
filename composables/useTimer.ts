import { onMounted, onUnmounted, ref } from "@nuxtjs/composition-api";

export default function () {
  const timeSinceMount = ref(0);

  const timer = undefined;

  onUnmounted(() => {
    clearInterval(timer);
  });

  onMounted(() => {
    timeSinceMount.value = 0;
    setInterval(() => {
      timeSinceMount.value++;
    }, 1000);
  });

  return {
    timeSinceMount,
  };
}
