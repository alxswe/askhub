import LayoutContainer from "@/components/layout/Container";
import { QuestionList } from "@/components/question/list";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <LayoutContainer>
      <div className="max-w-3xl py-6 lg:py-0">
        <h1 className="border-b border-gray-200 pb-5 pl-4 text-lg font-semibold text-gray-900 lg:pl-0">
          All Questions
        </h1>
        <div className="">
          <QuestionList />
        </div>
      </div>
    </LayoutContainer>
  );
}
