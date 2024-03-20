import LayoutContainer from "@/components/layout/Container";
import { QuestionList } from "@/components/question/list";
import { useSession } from "next-auth/react";

export default function QuestionListPage() {
  const { data: session } = useSession();

  return (
    <LayoutContainer>
      <h1 className="sr-only">Questions</h1>
      <QuestionList />
    </LayoutContainer>
  );
}
