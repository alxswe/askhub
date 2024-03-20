import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });

  if (req.method === "POST") {
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name } = req.body;
    const createdCommunity = await db.community.create({
      data: {
        name,
        createdBy: { connect: { id: session.user.id } },
        members: [session.user.id],
      },
    });
    res.status(201).json(createdCommunity);
  } else if (req.method === "GET") {
    // Get communities for a specific user
    const { userId } = req.query;

    if (userId) {
      const communities = await db.community.findMany({
        where: {
          members: {
            has: userId as string,
          },
        },
      });

      res.status(200).json(communities);
    } else {
      // Get all communities without filtering
      const communities = await db.community.findMany({
        take: req.query.take ? parseInt(req.query.take as string) : 9,
        skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
        orderBy: [{ name: "asc" }],
        where: {
          name: {
            contains: (req.query.search as string) ?? "",
          },
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
      res.status(200).json(communities);
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
