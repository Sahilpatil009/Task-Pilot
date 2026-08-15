"use client";

import { boardDataService, boardService } from "@/lib/services";
import type { Board } from "@/lib/supabase/models";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const { user, isLoaded: isUserLoaded } = useUser();
  const { supabase, isLoaded: isSupabaseLoaded } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCreatingRef = useRef(false);

  const userId = user?.id;

  const loadBoards = useCallback(async () => {
    if (!isUserLoaded || !isSupabaseLoaded) return;

    if (!userId) {
      setBoards([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError("Supabase client is unavailable.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase, userId);
      setBoards(data);
    } catch (err) {
      console.error("Failed to load boards", err);
      setError(getErrorMessage(err, "Failed to load boards."));
    } finally {
      setLoading(false);
    }
  }, [isSupabaseLoaded, isUserLoaded, supabase, userId]);

  useEffect(() => {
    const request = Promise.resolve().then(loadBoards);
    void request;
  }, [loadBoards]);

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (isCreatingRef.current) return;

    if (!userId || !supabase) {
      setError("User is not authenticated.");
      return;
    }

    isCreatingRef.current = true;
    setCreating(true);

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase,
        {
          ...boardData,
          userId,
        },
      );
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      console.error("Failed to create board", err);
      setError(getErrorMessage(err, "Failed to create board."));
    } finally {
      isCreatingRef.current = false;
      setCreating(false);
    }
  }

  return {
    boards,
    loading,
    creating,
    error,
    createBoard,
    refetch: loadBoards,
  };
}
