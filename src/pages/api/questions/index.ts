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

    const { name, content, communityId } = req.body;

    const parents: Record<string, any> = {};
    if (communityId) {
      parents.community = { connect: { id: communityId } };
    }

    const createdQuestion = await db.question.create({
      data: {
        name,
        content,
        createdBy: { connect: { id: session.user.id } },
        ...parents,
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
    res.status(201).json(createdQuestion);
  } else if (req.method === "GET") {
    // Get all questions

    const { communityId, createdById } = req.query;

    const where: Record<string, any> = {
      name: {
        contains: (req.query.search as string) ?? "",
      },
    };

    if (communityId) {
      where.communityId = communityId;
    }

    if (createdById) {
      where.createdById = createdById;
    }

    const orderBy = req.query.orderBy ?? "createdAt";
    const questions = await db.question.findMany({
      take: req.query.take ? parseInt(req.query.take as string) : 9,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
      orderBy: [{ [orderBy as string]: "desc" }],
      where,
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
