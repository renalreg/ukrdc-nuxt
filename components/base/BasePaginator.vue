<template>
  <nav class="flex items-center justify-between px-4 py-3 sm:px-6" aria-label="Pagination">
    <div class="hidden sm:block">
      <p class="text-gray-700">
        Showing
        <span class="font-medium">{{ (page - 1) * size + 1 }}</span>
        to
        <span class="font-medium">{{ Math.min(page * size, total) }}</span>
        of
        <span class="font-medium">{{ total }}</span>
        results
      </p>
    </div>
    <div class="flex flex-1 items-center justify-between gap-1 sm:justify-end">
      <BaseButton :class="{ invisible: page <= 1 }" @click="prev()"> Previous </BaseButton>
      <div v-if="showPages" class="flex items-center justify-between gap-1 sm:justify-end">
        <div v-for="(pageLink, index) in paginationElements" :key="'paginator-' + index">
          <span v-if="pageLink === '...'" class="hidden px-2 font-medium lg:block"> ... </span>
          <BaseButton
            v-else
            :colour="pageLink === page ? 'indigo' : 'white'"
            class="hidden lg:block"
            @click="jump(pageLink)"
          >
            {{ pageLink }}
          </BaseButton>
        </div>
      </div>
      <BaseButton :class="{ invisible: page * size >= total }" @click="next()"> Next </BaseButton>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import BaseButton from "~/components/base/BaseButton.vue";

type Pages = (number | "...")[];

export default defineComponent({
  components: {
    BaseButton,
  },
  props: {
    page: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    scrollTag: {
      type: String,
      required: false,
      default: "main",
    },
    jumpToTop: {
      type: Boolean,
      required: false,
      default: true,
    },
    showPages: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  setup(props, { emit }) {
    function pagination(current: number, total: number): Pages {
      if (total <= 1) {
        return [];
      }
      const center: Pages = [current - 2, current - 1, current, current + 1, current + 2];
      const filteredCenter = center.filter((p) => p > 1 && p < total);

      const includeThreeLeft = current === 5;
      const includeThreeRight = current === total - 4;

      const includeLeftDots = current > 5;
      const includeRightDots = current < total - 4;

      if (includeThreeLeft) filteredCenter.unshift(2);
      if (includeThreeRight) filteredCenter.push(total - 1);

      if (includeLeftDots) filteredCenter.unshift("...");
      if (includeRightDots) filteredCenter.push("...");

      return [1, ...filteredCenter, total];
    }

    const paginationElements = computed(() => {
      return pagination(props.page, Math.ceil(props.total / props.size));
    });

    function next(): void {
      emit("next");
      toTop();
    }

    function prev(): void {
      emit("prev");
      toTop();
    }

    function jump(page: number): void {
      emit("jump", page);
      toTop();
    }

    function toTop(): void {
      if (props.jumpToTop) {
        document.getElementsByTagName(props.scrollTag)[0].scrollTop = 0;
      }
    }

    const currentPageClasses = ["bg-indigo-500", "text-white"];

    return {
      next,
      prev,
      jump,
      paginationElements,
      currentPageClasses,
    };
  },
});
</script>

<style></style>
