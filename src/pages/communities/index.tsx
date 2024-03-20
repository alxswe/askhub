import CommunityList from "@/components/community/component";
import LayoutContainer from "@/components/layout/Container";
import { getServerAuthSession } from "@/server/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default function CommunityListPage() {
  return (
    <LayoutContainer>
      <div className="max-w-3xl pt-6 lg:pt-0">
        <CommunityList />
      </div>
    </LayoutContainer>
  );
}

export const getServerSideProps = async (ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getServerAuthSession(ctx);
  return { props: { session } };
};
