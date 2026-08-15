export const getPriorityColor = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "high":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
};

export type DueStatus = "overdue" | "due-soon" | "on-track" | "no-date";

export function getDueStatus(dueDate: string | null): DueStatus {
  if (!dueDate) {
    return "no-date";
  }

  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const soonThreshold = new Date(today);
  soonThreshold.setDate(today.getDate() + 7);

  if (due < today) {
    return "overdue";
  }

  if (due <= soonThreshold) {
    return "due-soon";
  }

  return "on-track";
}

export function formatDueStatus(status: DueStatus) {
  switch (status) {
    case "overdue":
      return "Overdue";
    case "due-soon":
      return "Due soon";
    case "on-track":
      return "On track";
    default:
      return "No due date";
  }
}

export function getBoardStats(
  columns: Array<{
    tasks: { due_date: string | null; priority: "low" | "medium" | "high" }[];
  }>,
) {
  const stats = {
    totalTasks: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    dueSoon: 0,
    overdue: 0,
  };

  const today = new Date();
  const soonThreshold = new Date(today);
  soonThreshold.setDate(today.getDate() + 7);

  for (const column of columns) {
    for (const task of column.tasks) {
      stats.totalTasks += 1;

      if (task.priority === "high") {
        stats.highPriority += 1;
      } else if (task.priority === "medium") {
        stats.mediumPriority += 1;
      } else {
        stats.lowPriority += 1;
      }

      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        if (dueDate < today) {
          stats.overdue += 1;
        } else if (dueDate <= soonThreshold) {
          stats.dueSoon += 1;
        }
      }
    }
  }

  return stats;
}
