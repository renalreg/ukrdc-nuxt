import Vue from "vue";
import { SurveySchema } from "@ukkidney/ukrdc-axios-ts";

export interface modalInterface extends Vue {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  visible: boolean;
}

export interface surveyViewerModalInterface extends Vue {
  show: (surveyToShow: SurveySchema) => void;
  hide: () => void;
  toggle: () => void;
  visible: boolean;
}
