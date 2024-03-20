import { HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import UserCommunities from "../community/user";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: false },

  {
    name: "Communities",
    href: "/communities",
    icon: UserGroupIcon,
    current: false,
  },
];

export default function LeftSidebar({ communitites = [] }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav aria-label="Sidebar" className="sticky top-4 divide-y divide-gray-300">
      <div className="space-y-1 pb-8">
        {navigation.map((item) => {
          if (item.href === "/") {
            item.current = pathname === item.href;
          } else {
            item.current = pathname?.includes(item.href);
          }
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                item.current
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50",
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={clsx(
                  item.current
                    ? "text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-1 mr-3 h-6 w-6 flex-shrink-0",
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
      {session?.user && (
        <div className="pt-10">
          <UserCommunities />
        </div>
      )}
    </nav>
  );
}

export const MemoizedSidebar = memo(LeftSidebar);
