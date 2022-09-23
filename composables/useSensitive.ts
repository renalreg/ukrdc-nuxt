import { computed, useContext } from "@nuxtjs/composition-api";

export default function () {
  // Blanks out all characters in a string, if demo mode is enabled
  const { $config } = useContext();

  function sensitive(value: string | undefined): string | undefined {
    if (value && $config.demoMode) {
      return value.replace(/./g, "*");
    }
    return value;
  }

  function sensitiveNumbers(value: string | undefined): string | undefined {
    if (value && $config.demoMode) {
      return value.replace(/\d/g, "0");
    }
    return value;
  }

  const sensitiveCssFilter = computed(() => {
    if ($config.demoMode) {
      return "blur(8px)";
    } else {
      return "none";
    }
  });

  return {
    sensitive,
    sensitiveNumbers,
    sensitiveCssFilter,
  };
}
