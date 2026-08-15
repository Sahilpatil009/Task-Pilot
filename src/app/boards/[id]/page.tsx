import Board from "@/features/boards/components/Board";
import { auth } from "@clerk/nextjs/server";

export default async function BoardPage() {
  await auth.protect();

  return <Board />;
}
