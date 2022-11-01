// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { firebaseAdmin } from "../../server/trpc/router/auth";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = JSON.stringify(req.headers.authorization);

  if (!token) {
    res.status(404).json({ message: "missing token" });
    return;
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    const user = await prisma?.user.findFirst({
      where: {
        email: decodedToken.email,
      },
      select: {
        email: true,
        name: true,
        id: true,
      },
    });

    res.status(200).json({ user });
  } catch (e: any) {
    console.error(e);

    res.status(500).json({ message: "server error" });
  }
};

export default examples;
