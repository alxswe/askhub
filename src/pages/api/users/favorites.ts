import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Get a single user by id
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orderBy = req.query.orderBy ?? "createdAt";
    const questions = await db.question.findMany({
      take: req.query.take ? parseInt(req.query.take as string) : 9,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
      orderBy: [{ [orderBy as string]: "desc" }],
      where: {
        id: {
          in: user.bookmark,
        },
      },
      include: {
        community: true,
        createdBy: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    res.status(200).json(questions);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
