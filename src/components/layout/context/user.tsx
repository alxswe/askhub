import { ICommunity } from "@/components/community/component";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useEffect, useState } from "react";

export const UserContext = createContext<{
  currentUser: any;
  communities: ICommunity[];
  setUser: (...args: any) => any;
}>({
  currentUser: null,
  communities: [],
  setUser: () => {},
});

export default function UserContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [currentUser, setUser] = useState(null);
  const [communities, setCommunities] = useState([]);

  const loadUser = useCallback(async () => {
    const res = await fetch("/api/users/" + session?.user?.id, {
      credentials: "include",
    });
    if (res.ok) {
      const dt = await res.json();
      setUser(dt);
    }
  }, [session?.user?.id]);

  const loadCommunities = useCallback(async () => {
    const search = new URLSearchParams();
    search.set("userId", session?.user.id as string);
    const res = await fetch(`/api/communities/?${search}`, {
      credentials: "include",
    });
    if (res.ok) {
      const dt = await res.json();
      console.log({ dt });
      setCommunities(dt);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadUser();
    loadCommunities();
  }, [loadCommunities, loadUser]);

  return (
    <UserContext.Provider value={{ currentUser, setUser, communities }}>
      {children}
    </UserContext.Provider>
  );
}
