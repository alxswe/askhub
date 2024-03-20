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
    // Get a single question by id
    const question = await db.question.findUnique({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
      },
      include: {
        createdBy: true,
        community: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(question);
  } else if (req.method === "PUT") {
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update a question by id
    const { name, content, likes, upvotes, downvotes } = req.body;
    const updatedQuestion = await db.question.update({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
        createdById: session.user.id,
      },
      data: { name, content, likes, upvotes, downvotes },
      include: {
        createdBy: true,
        community: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    res.status(200).json(updatedQuestion);
  } else if (req.method === "DELETE") {
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Delete a question by id
    const deletedQuestion = await db.question.delete({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
        createdById: session.user.id,
      },
    });
    res.status(200).json(deletedQuestion);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
