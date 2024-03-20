import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../layout/context/user";

export default function UserCommunities() {
  const { data: session } = useSession();
  const { communities } = useContext(UserContext);

  return (
    <div>
      <p
        className="px-3 text-sm font-medium text-gray-500"
        id="communities-headline"
      >
        My Communities
      </p>
      <div className="mt-3 space-y-2" aria-labelledby="communities-headline">
        {communities.map((community) => (
          <Link
            key={community.name}
            href={{
              pathname: "/communities/[id]",
              query: { id: community.id },
            }}
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            <span className="truncate">{community.name}</span>
          </Link>
        ))}
        <Link
          href="/communities"
          className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <span className="truncate">All</span>
        </Link>
      </div>
    </div>
  );
}
