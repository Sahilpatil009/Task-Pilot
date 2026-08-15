"use client";

import { boardDataService, boardService } from "@/lib/services";
import { Board } from "@/lib/supabase/models";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export function useBoards() {
  const { user } = useUser();
  const { supabase, isLoaded } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isLoaded && supabase) {
      loadBoards();
    }
  }, [user, isLoaded]);

  async function loadBoards() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      console.error("Failed to load boards", err);
      setError(getErrorMessage(err, "Failed to load boards."));
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not authenticated");

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id,
        },
      );
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      console.error("Failed to create board", err);
      setError(getErrorMessage(err, "Failed to create board."));
    }
  }

  const refetch = () => {
    loadBoards();
  };

  return { boards, loading, error, createBoard, refetch };
}
