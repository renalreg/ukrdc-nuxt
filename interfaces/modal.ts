import Vue from "vue";

export interface modalInterface extends Vue {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  visible: boolean;
}
