import { SurveySchema } from "@ukkidney/ukrdc-axios-ts";
import Vue from "vue";

export interface ModalInterface extends Vue {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  visible: boolean;
}

export interface SurveyViewerModalInterface extends Vue {
  show: (surveyToShow: SurveySchema) => void;
  hide: () => void;
  toggle: () => void;
  visible: boolean;
}
