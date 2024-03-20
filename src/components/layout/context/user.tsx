import { ICommunity } from "@/components/community/component";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useCallback, useEffect, useState } from "react";

type UserContextType = {
  currentUser: null | User;
  communities: ICommunity[];
  setUser: (...args: any) => any;
};

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  communities: [],
  setUser: () => {},
});

export default function UserContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentUser, setUser] = useState<UserContextType["currentUser"]>(null);
  const [communities, setCommunities] = useState([]);

  const loadCommunities = useCallback(async () => {
    const search = new URLSearchParams();
    search.set("userId", session?.user.id as string);
    const res = await fetch(`/api/communities/?${search}`, {
      credentials: "include",
    });
    if (res.ok) {
      const dt = await res.json();
      setCommunities(dt);
    }
  }, [session?.user?.id]);

  const loadUser = useCallback(async () => {
    if (session?.user?.id) {
      const res = await fetch("/api/users/" + session?.user?.id, {
        credentials: "include",
      });
      if (res.ok) {
        const dt = await res.json();
        setUser(dt);

        await loadCommunities();
      }
    }
  }, [session?.user?.id, loadCommunities]);

  useEffect(() => {
    if (router.isReady) {
      loadUser();
    }
  }, [loadCommunities, loadUser, router.isReady]);

  return (
    <UserContext.Provider value={{ currentUser, setUser, communities }}>
      {children}
    </UserContext.Provider>
  );
}
