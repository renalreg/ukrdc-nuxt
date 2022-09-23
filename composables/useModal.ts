import { ref } from "@nuxtjs/composition-api";

export default function () {
  const visible = ref(false);

  function show(): void {
    visible.value = true;
  }
  function hide(): void {
    visible.value = false;
  }
  function toggle(): void {
    visible.value = !visible.value;
  }

  return {
    visible,
    show,
    hide,
    toggle,
  };
}
