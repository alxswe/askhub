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

    const { content, communityId, questionId } = req.body;

    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    const parents: Record<string, any> = {};
    if (communityId) {
      parents.community = { connect: { id: communityId } };
    } else {
      if (question && question.communityId) {
        parents.community = { connect: { id: question?.communityId } };
      }
    }

    const createdComment = await db.comment.create({
      data: {
        content,
        createdBy: { connect: { id: session.user.id } },
        question: { connect: { id: questionId } },
        ...parents,
      },

      include: {
        question: true,
        community: true,
        createdBy: true,
      },
    });
    res.status(201).json(createdComment);
  } else if (req.method === "GET") {
    // Get all comments

    const { communityId, questionId } = req.query;

    const where: Record<string, any> = {};
    if (communityId) {
      where.communityId = communityId;
    }
    if (questionId) {
      where.questionId = questionId;
    }

    const comments = await db.comment.findMany({
      take: req.query.take ? parseInt(req.query.take as string) : 9,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
      orderBy: [{ createdAt: "desc" }],
      where,
      include: {
        question: true,
        community: true,
        createdBy: true,
      },
    });
    res.status(200).json(comments);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
