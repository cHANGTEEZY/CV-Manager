"use client";

import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { AlertCircle, Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Task {
  id: string;
  content: string;
}

interface TasksState {
  [columnId: string]: Task[];
}

interface TaskProps {
  id: string;
  content: string;
  className?: string;
  columnType?: string;
}

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  type?: string;
}

const initialTasks: TasksState = {
  "Applicant-List": [
    { id: "task-1", content: "Review resume: John Doe" },
    { id: "task-2", content: "Screen application: Jane Smith" },
    { id: "task-3", content: "Verify portfolio: Alex Johnson" },
    { id: "task-4", content: "Check LinkedIn profile: Sara Khan" },
  ],
  Assessment1: [
    { id: "task-5", content: "Send coding assessment to John Doe" },
    { id: "task-6", content: "Evaluate JavaScript test: Jane Smith" },
    { id: "task-7", content: "Send reminder for pending test: Alex Johnson" },
  ],
  Assessment2: [
    { id: "task-8", content: "Design aptitude test for Sara Khan" },
    { id: "task-9", content: "Check assessment results: Jane Smith" },
    { id: "task-10", content: "Schedule follow-up test for John Doe" },
  ],
  "Final-interview": [
    { id: "task-11", content: "Conduct final HR interview: Jane Smith" },
    { id: "task-12", content: "Collect feedback from HR panel" },
    { id: "task-13", content: "Finalize candidate decision: John Doe" },
  ],
  "technical-interview": [
    { id: "task-14", content: "Schedule technical interview: Alex Johnson" },
    { id: "task-15", content: "Prepare technical questions set" },
    { id: "task-16", content: "Evaluate coding interview: Sara Khan" },
  ],
  Offer: [
    { id: "task-17", content: "Create offer letter: Jane Smith" },
    { id: "task-18", content: "Send offer via email: John Doe" },
    { id: "task-19", content: "Confirm acceptance: Alex Johnson" },
  ],
  Rejected: [
    { id: "task-20", content: "Send rejection email: Sara Khan" },
    { id: "task-21", content: "Mark candidate inactive: Mark Lee" },
    { id: "task-22", content: "Update rejection reason: Tim Baker" },
  ],
};

function Task({ id, content, className = "", columnType }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { content },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  const getBgColor = () => {
    if (columnType === "rejected") return " border-red-200";
    if (columnType === "offer") return " border-green-200";
    return "";
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 mb-2 cursor-pointer hover:shadow-md transition-all ${getBgColor()} ${className}`}
    >
      {content}
    </Card>
  );
}

function Column({ id, title, tasks, type }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnStyles = () => {
    let baseStyles =
      "w-full p-5 mb-4 transition-all duration-200 flex flex-col ";

    if (isOver) {
      baseStyles += "border-blue-500 shadow-md ";
    }

    if (type === "rejected") {
      baseStyles += "border-l-4 border-l-red-500  ";
    } else if (type === "offer") {
      baseStyles += "border-l-4 border-l-green-500  ";
    } else {
      baseStyles += "border-l-3 border-l-muted-foreground  hover:shadow-sm ";
    }

    return baseStyles;
  };

  return (
    <Card ref={setNodeRef} className={getColumnStyles()}>
      <CardHeader className="p-0 font-bold text-lg m-0 ">
        {type === "rejected" && (
          <X className="inline-flex mr-2 text-red-500" size={18} />
        )}
        {type === "offer" && (
          <Check className="inline-flex mr-2 text-green-500" size={18} />
        )}
        {title}
      </CardHeader>
      <CardDescription className="mt-2">
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            content={task.content}
            columnType={type}
          />
        ))}
      </CardDescription>
    </Card>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<TasksState>(initialTasks);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: string;
    content: string;
  } | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    type: string;
    content: string;
    sourceColumn: string;
    destinationColumn: string;
    taskId: string;
  } | null>(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const sourceColumn = Object.keys(tasks).find((columnId) =>
      tasks[columnId].some((task) => task.id === taskId),
    );
    const destinationColumn = over.id;

    // Don't do anything if dropped in the same column or if source column wasn't found
    if (!sourceColumn || sourceColumn === destinationColumn) {
      return;
    }

    const taskContent =
      tasks[sourceColumn].find((task) => task.id === taskId)?.content || "";

    if (destinationColumn === "Rejected") {
      setConfirmDialog({
        show: true,
        type: "reject",
        content: taskContent,
        sourceColumn,
        destinationColumn,
        taskId,
      });
    }
    else if (destinationColumn === "Offer") {
      setConfirmDialog({
        show: true,
        type: "offer",
        content: taskContent,
        sourceColumn,
        destinationColumn,
        taskId,
      });
    }
    else {
      moveTask(sourceColumn, destinationColumn, taskId);
    }
  };

  const handleConfirm = () => {
    if (!confirmDialog) return;

    const { sourceColumn, destinationColumn, taskId, type, content } =
      confirmDialog;

    moveTask(sourceColumn, destinationColumn, taskId);

    setNotification({
      show: true,
      type,
      content:
        type === "reject"
          ? `${content} has been moved to rejected list`
          : `Offer will be prepared for ${content}`,
    });

    setTimeout(() => setNotification(null), 3000);
    setConfirmDialog(null);
  };

  const handleCancel = () => {
    setConfirmDialog(null);
  };

  const moveTask = (sourceColumn, destinationColumn, taskId) => {
    setTasks((prev) => {
      const taskToMove = prev[sourceColumn].find((task) => task.id === taskId);

      if (!taskToMove) return prev;

      const newSourceColumn = prev[sourceColumn].filter(
        (task) => task.id !== taskId,
      );

      const newDestinationColumn = [...prev[destinationColumn], taskToMove];

      return {
        ...prev,
        [sourceColumn]: newSourceColumn,
        [destinationColumn]: newDestinationColumn,
      };
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <section className="mx-auto mt-5 max-w-[1000px] p-6 ">
        <div className="mb-6">
          <h1 className="text-3xl font-bold ">
            Applicant Progress Management Board
          </h1>
          <p className="text-muted-foreground">
            Track and manage the applicant's progress visually. Drag and drop
            applicants between stages.
          </p>
        </div>

        {notification && (
          <Alert
            className={
              notification.type === "reject"
                ? "bg-red-50 border-red-200 mb-4"
                : "bg-green-50 border-green-200 mb-4"
            }
          >
            <AlertCircle
              className={
                notification.type === "reject"
                  ? "text-red-500"
                  : "text-green-500"
              }
            />
            <AlertTitle className="text-black">
              {notification.type === "reject"
                ? "Applicant Rejected"
                : "Offer Confirmed"}
            </AlertTitle>
            <AlertDescription className="text-black">{notification.content}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h2 className="text-primary text-xl font-semibold mb-4">
            Applicant Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Column
              id="Applicant-List"
              title="Applicants"
              tasks={tasks["Applicant-List"]}
            />
            <Column
              id="Rejected"
              title="Rejected List"
              tasks={tasks["Rejected"]}
              type="rejected"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-primary text-xl font-semibold mb-4">
            Assessment Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Column
              id="Assessment1"
              title="Assessment 1"
              tasks={tasks["Assessment1"]}
            />
            <Column
              id="Assessment2"
              title="Assessment 2"
              tasks={tasks["Assessment2"]}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-primary text-xl font-semibold mb-4">
            Interview Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Column
              id="technical-interview"
              title="Technical Interview"
              tasks={tasks["technical-interview"]}
            />
            <Column
              id="Final-interview"
              title="Final Interview"
              tasks={tasks["Final-interview"]}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-primary text-xl font-semibold mb-4">
            Offer Management
          </h2>
          <Column
            id="Offer"
            title="Offer"
            tasks={tasks["Offer"]}
            type="offer"
          />
        </div>

        <AlertDialog
          open={confirmDialog?.show}
          onOpenChange={(open) => !open && setConfirmDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog?.type === "reject"
                  ? "Confirm Rejection"
                  : "Confirm Offer"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog?.type === "reject"
                  ? `Are you sure you want to reject "${confirmDialog?.content}"?`
                  : `Are you sure you want to send an offer to "${confirmDialog?.content}"?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className={
                  confirmDialog?.type === "reject"
                    ? "bg-red-500 hover:bg-red-600"
                    : ""
                }
              >
                {confirmDialog?.type === "reject" ? "Reject" : "Confirm Offer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </DndContext>
  );
}
