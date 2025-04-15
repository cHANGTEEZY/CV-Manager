import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";

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
}

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
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

function Task({ classname, id, content }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { content },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 mb-2  cursor-pointer ${classname} `}
    >
      {content}
    </Card>
  );
}

function Column({ id, title, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={`w-full p-5 ${
        title === "Rejected" ? "border-red-400" : ""
      }  flex flex-col ${isOver ? " border-blue-300" : ""}`}
    >
      <CardHeader className="p-0 font-bold text-lg m-0 ">{title}</CardHeader>
      <CardDescription>
        {tasks.map((task) => (
          <Task key={task.id} id={task.id} content={task.content} />
        ))}
      </CardDescription>
    </Card>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<TasksState>(initialTasks);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const sourceColumn = Object.keys(tasks).find((columnId) =>
      tasks[columnId].some((task) => task.id === taskId)
    );
    const destinationColumn = over.id;

    // Don't do anything if dropped in the same column or if source column wasn't found
    if (!sourceColumn || sourceColumn === destinationColumn) {
      return;
    }

    setTasks((prev) => {
      // Find the task object
      const taskToMove = prev[sourceColumn].find((task) => task.id === taskId);

      // If task wasn't found
      if (!taskToMove) return prev;

      // Remove from source column
      const newSourceColumn = prev[sourceColumn].filter(
        (task) => task.id !== taskId
      );

      // Add to destination column
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
      <section className="m-6">
        <h1 className="text-2xl font-bold mb-6">
          Applicant Progress Management Board
        </h1>
        <h3>Applicants List</h3>
        <Column
          id="Applicant List"
          title="Applicants"
          tasks={tasks["Applicant-List"]}
        />

        <h3>Assessment Management</h3>
        <Column
          id="assignment-1"
          title="Assessment 1"
          tasks={tasks.Assessment1}
        />
        <Column
          id="assignment-2"
          title="Assessment 2"
          tasks={tasks.Assessment2}
        />

        <h3>Interview Management</h3>
        <Column
          id="Final-interview"
          title="Final Interview"
          tasks={tasks["Final-interview"]}
        />
        <Column
          id="technical-interview"
          title="Technical Interview"
          tasks={tasks["technical-interview"]}
        />

        <Column id="Offer" title="Offer" tasks={tasks.Offer} />

        <h3>Rejection Management</h3>
        <Column id="Rejected" title="Rejected List" tasks={tasks.Rejected} />
      </section>
    </DndContext>
  );
}
