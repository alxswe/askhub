import { createContext } from "react";

type CommentListContextType = {
  addCommentToList: (...args: any) => void;
  updateCommentInList: (...args: any) => void;
  removeCommentFromList: (...args: any) => void;
};

export const CommentListContext = createContext<CommentListContextType>({
  addCommentToList: () => {},
  updateCommentInList: () => {},
  removeCommentFromList: () => {},
});
