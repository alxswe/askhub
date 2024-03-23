import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

const include = {
  question: true,
  community: true,
  createdBy: true,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });

  const { id } = req.query;

  if (req.method === "GET") {
    // Get a single comment by id
    const comment = await db.comment.findUnique({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
      },
      include,
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(comment);
  } else if (req.method === "PUT") {
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update a comment by id
    const { content } = req.body;
    const updatedQuestion = await db.comment.update({
      where: {
        // @ts-expect-error: Type 'string | string[] | undefined' is not assignable to type 'string | undefined'.ts(2322)
        id,
        createdById: session.user.id,
      },
      data: {
        content,
      },
      include,
    });
    res.status(200).json(updatedQuestion);
  } else if (req.method === "DELETE") {
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Delete a comment by id
    const deletedQuestion = await db.comment.delete({
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
