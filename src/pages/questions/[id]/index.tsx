/* eslint-disable @next/next/no-img-element */
import LayoutContainer from "@/components/layout/Container";
import { loadQuestion } from "@/components/loaders/loader";
import { QuestionDetail } from "@/components/question/detail";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSidePropsContext } from "next";

interface Props {
  _question: IQuestion;
}

export default function QuestionDetailPage({ _question }: Props) {
  return (
    <LayoutContainer>
      <div className="px-4 py-6 lg:px-0 lg:py-0">
        <QuestionDetail _question={_question} />
      </div>
    </LayoutContainer>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  const _question = await loadQuestion(ctx.params!.id as string);

  if (!_question) {
    return {
      notFound: true,
    };
  }

  return { props: { session, _question } };
};
