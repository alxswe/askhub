import Layout from "@/components/layout/Layout";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignOut() {
    const router = useRouter();

    useEffect(() => {
        signOut({ redirect: false }).then((res) => router.push("/"));
    }, [router]);

    return (
        <Layout>
            <></>
        </Layout>
    );
}
