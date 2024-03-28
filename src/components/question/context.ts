import { createContext } from "react";

export const QuestionListContext = createContext<{
  communityId: any;
  addQuestionToList: (...args: any) => void;
  updateQuestionInList: (...args: any) => void;
  removeQuestionFromList: (...args: any) => void;
}>({
  communityId: null,
  addQuestionToList: () => {},
  updateQuestionInList: () => {},
  removeQuestionFromList: () => {},
});
