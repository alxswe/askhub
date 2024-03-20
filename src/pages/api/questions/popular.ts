import { db } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const questions = await db.question.findMany({
      take: req.query.take ? parseInt(req.query.take as string) : 9,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
      orderBy: [{ likes: "desc" }, { comments: { _count: "desc" } }],
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
