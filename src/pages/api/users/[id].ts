import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Get a single user by id
    const user = await db.user.findUnique({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
      },
      include: {
        communities: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } else if (req.method === "PUT") {
    const session = await getServerAuthSession({ req, res });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update a question by id
    const { bookmark } = req.body;
    const currentUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: { ...req.body, id: undefined },
    });
    console.log({ currentUser });
    res.status(200).json(currentUser);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
