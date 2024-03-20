import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });

  const { id } = req.query;

  if (req.method === "GET") {
    // Get a single community by id
    const community = await db.community.findUnique({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
      },
      include: {
        createdBy: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    res.status(200).json(community);
  } else if (req.method === "PUT") {
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update a community by id
    const { name, members } = req.body;
    const updatedCommunity = await db.community.update({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
        createdById: session.user.id,
      },
      data: {
        name,
        members,
      },
      include: {
        createdBy: true,
      },
    });
    res.status(200).json(updatedCommunity);
  } else if (req.method === "DELETE") {
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Delete a community by id
    const deletedCommunity = await db.community.delete({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
        createdById: session.user.id,
      },
    });
    res.status(200).json(deletedCommunity);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
