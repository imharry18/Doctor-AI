import { getServerSession } from "next-auth/next";
import { authOptions, prisma } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Find the user's most recent chat, or create one natively
    let chat = await prisma.chat.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { userId: session.user.id }
      });
      chat.messages = [];
    }

    return new Response(JSON.stringify({ chat }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
