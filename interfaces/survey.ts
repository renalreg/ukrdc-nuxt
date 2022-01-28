export interface SurveyQuestion {
  id: string;
  questiontypecode: string;
  response: string;

  questionGroup: string;
  questionType: string;
  responseText: string;
}

export interface SurveyScore {
  id: string;
  value: string;
  scoretypecode: string;
}

export interface SurveyLevel {
  id: string;
  value: string;
  leveltypecode: string;
}

export interface Survey {
  id: string;
  pid: string;
  surveytime: string;
  surveytypecode: string;
  enteredbycode: string;
  enteredatcode: string;

  questions: SurveyQuestion[];
  scores: SurveyScore[];
  levels: SurveyLevel[];
}
