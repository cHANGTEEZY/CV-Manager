import { useEffect, useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  ClipboardCheck,
  ClipboardList,
  Code,
  FileCheck,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import useTableData from '@/hooks/use-table-data';
import { Separator } from '@/components/ui/separator';

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
  description: string;
  icon?: React.ReactNode;
}

const initialTasks: TasksState = {
  'Applicant-List': [],
  Assessment1: [],
  Assessment2: [],
  'Final-interview': [],
  'technical-interview': [],
  Offer: [],
  Rejected: [],
};

function Task({ id, content, className = '', columnType }: TaskProps) {
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
    if (columnType === 'rejected') return ' border-red-200';
    if (columnType === 'offer') return ' border-green-200';
    return '';
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`mb-2 p-3 transition-all hover:shadow-md ${getBgColor()} ${className}`}
    >
      {content}
    </Card>
  );
}

function Column({ id, title, tasks, type, description, icon }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnStyles = () => {
    let baseStyles =
      'w-full p-5 mb-4 transition-all duration-200 flex flex-col ';

    if (isOver) {
      baseStyles += 'border-blue-500 shadow-md ';
    }

    if (type === 'rejected') {
      baseStyles += 'border-l-4 border-l-red-500 border-t-red-500 ';
    } else if (type === 'offer') {
      baseStyles += 'border-l-4 border-l-green-500 border-l-green-500 ';
    } else {
      baseStyles +=
        'border-l-3 border-l-muted-foreground border-t-muted-foreground  hover:shadow-sm ';
    }

    return baseStyles;
  };

  return (
    <Card ref={setNodeRef} className={getColumnStyles()}>
      <CardHeader className="x m-0 p-0 text-lg font-bold">
        <CardTitle>
          {icon && <span className="mr-2 inline-flex">{icon}</span>}
          {title}
        </CardTitle>
        <CardDescription className="text-xs font-medium">
          {description}
        </CardDescription>
      </CardHeader>
      <CardDescription className="mt-2">
        {tasks.length > 0 ? (
          <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 h-[300px] overflow-y-auto pr-2 whitespace-pre-line">
            {tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                content={task.content}
                columnType={type}
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
            No applicants in this column
          </div>
        )}
      </CardDescription>
    </Card>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<TasksState>(initialTasks);
  console.log('all tasks', tasks);
  const { tableData } = useTableData();
  console.log('TData is ', tableData);
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const sourceColumn = Object.keys(tasks).find((columnId) =>
      tasks[columnId].some((task) => task.id === taskId)
    );
    const destinationColumn = over.id;

    if (!sourceColumn || sourceColumn === destinationColumn) {
      return;
    }

    const taskContent =
      tasks[sourceColumn].find((task) => task.id === taskId)?.content || '';

    if (destinationColumn === 'Rejected') {
      setConfirmDialog({
        show: true,
        type: 'reject',
        content: taskContent,
        sourceColumn,
        destinationColumn,
        taskId,
      });
    } else if (destinationColumn === 'Offer') {
      setConfirmDialog({
        show: true,
        type: 'offer',
        content: taskContent,
        sourceColumn,
        destinationColumn,
        taskId,
      });
    } else {
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
        type === 'reject'
          ? `${content} has been moved to rejected list`
          : `Offer will be prepared for ${content}`,
    });

    setTimeout(() => setNotification(null), 3000);
    setConfirmDialog(null);
  };

  const handleCancel = () => {
    setConfirmDialog(null);
  };

  const moveTask = (sourceColumn: any, destinationColumn: any, taskId: any) => {
    setTasks((prev) => {
      const taskToMove = prev[sourceColumn].find((task) => task.id === taskId);

      if (!taskToMove) return prev;

      const newSourceColumn = prev[sourceColumn].filter(
        (task) => task.id !== taskId
      );

      const newDestinationColumn = [...prev[destinationColumn], taskToMove];

      return {
        ...prev,
        [sourceColumn]: newSourceColumn,
        [destinationColumn]: newDestinationColumn,
      };
    });
  };

  useEffect(() => {
    if (tableData && Array.isArray(tableData)) {
      const statusMap = {
        rejected: ['Failed', 'Rejected', 'rejected', 'Fail'],
        offer: ['Offer', 'Hired', 'Applicant Eligble for Offer', 'Hire'],
        applicantList: ['filled'],
        firstInterview: ['Interview 1 Scheduled', 'Interview 1 Passed'],
        secondInterview: ['Interview 2 Scheduled', 'Interview 2 Passed'],
        thirdInterview: ['Interview 3 Scheduled', 'Interview 3 Passed'],
        assessment1: ['Assessment 1 Assigned', 'Assessment 1 Passed'],
        assessment2: ['Assessment 2 Assigned', 'Assessment 2 Passed'],
      };

      const formatContent = (applicant: any) =>
        `Name: ${applicant.applicant_name}\nEmail: ${applicant.applicant_email}\nStatus: ${applicant.applicant_status}`;

      const getList = (statuses: any, listIdPrefix: any) =>
        tableData
          .filter((item) => statuses.includes(item.applicant_status))
          .map((applicant, index) => ({
            id: `${listIdPrefix}-${index}`,
            content: formatContent(applicant),
          }));

      const rejectedList = tableData
        .filter((r) => statusMap.rejected.includes(r.applicant_verdict))
        .map((applicant, index) => ({
          id: `rejected-${index}`,
          content: formatContent(applicant),
        }));

      const offerList = tableData
        .filter((r) => statusMap.offer.includes(r.applicant_verdict))
        .map((applicant, index) => ({
          id: `offer-${index}`,
          content: formatContent(applicant),
        }));

      setTasks((prevData) => ({
        ...prevData,
        'Applicant-List': getList(statusMap.applicantList, 'applicant'),
        'technical-interview': getList(
          statusMap.firstInterview,
          'first-interview'
        ),
        'Final-interview': getList(
          statusMap.secondInterview,
          'second-interview'
        ),
        'Interview-3': getList(statusMap.thirdInterview, 'third-interview'),
        Assessment1: getList(statusMap.assessment1, 'assessment1'),
        Assessment2: getList(statusMap.assessment2, 'assessment2'),
        Rejected: rejectedList,
        Offer: offerList,
      }));
    }
  }, [tableData]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <section className="mx-auto mt-5 max-w-[1000px] p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
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
              notification.type === 'reject'
                ? 'mb-4 border-red-200 bg-red-50'
                : 'mb-4 border-green-200 bg-green-50'
            }
          >
            <AlertCircle
              className={
                notification.type === 'reject'
                  ? 'text-red-500'
                  : 'text-green-500'
              }
            />
            <AlertTitle className="text-black">
              {notification.type === 'reject'
                ? 'Applicant Rejected'
                : 'Offer Confirmed'}
            </AlertTitle>
            <AlertDescription className="text-black">
              {notification.content}
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        <div className="mb-8">
          <h2 className="text-primary my-4 text-xl font-semibold">
            Applicant Management
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Column
              id="Applicant-List"
              title="Applicants"
              tasks={tasks['Applicant-List']}
              description="New applications awaiting initial screening and evaluation"
              icon={<UserPlus size={18} className="text-blue-500" />}
            />
            <Column
              id="Rejected"
              title="Rejected List"
              description="Candidates who didn't meet requirements or weren't selected to proceed"
              tasks={tasks['Rejected']}
              type="rejected"
              icon={<UserX size={18} className="text-red-500" />}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-primary mb-4 text-xl font-semibold">
            Interview Management
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Column
              id="technical-interview"
              title="First Interview"
              description="Candidates scheduled for technical evaluation"
              tasks={tasks['technical-interview'] || []}
              icon={
                <Code
                  size={18}
                  className="whitespace-pre-line text-indigo-500"
                />
              }
            />
            <Column
              id="Final-interview"
              title="Second Interview"
              description="Applicants in second round interview"
              tasks={tasks['Final-interview'] || []}
              icon={
                <Users
                  size={18}
                  className="whitespace-pre-line text-indigo-600"
                />
              }
            />
            <Column
              id="Interview-3"
              title="Third Interview"
              description="Final round interview with leadership"
              tasks={tasks['Interview-3'] || []}
              icon={
                <Users
                  size={18}
                  className="whitespace-pre-line text-indigo-700"
                />
              }
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-primary mb-4 text-xl font-semibold">
            Assessment Management
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Column
              id="Assessment1"
              title="Assessment 1"
              description="First round technical assessment"
              tasks={tasks['Assessment1'] || []}
              icon={<ClipboardList size={18} className="text-amber-500" />}
            />
            <Column
              id="Assessment2"
              title="Assessment 2"
              description="Advanced technical assessment"
              tasks={tasks['Assessment2'] || []}
              icon={<ClipboardCheck size={18} className="text-amber-600" />}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-primary mb-4 text-xl font-semibold">
            Offer Management
          </h2>
          <Column
            id="Offer"
            title="Offer"
            description="Successful candidates receiving or negotiating employment offers"
            tasks={tasks['Offer']}
            type="offer"
            icon={<FileCheck size={18} className="text-green-500" />}
          />
        </div>

        <AlertDialog
          open={confirmDialog?.show}
          onOpenChange={(open) => !open && setConfirmDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog?.type === 'reject'
                  ? 'Confirm Rejection'
                  : 'Confirm Offer'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog?.type === 'reject'
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
                  confirmDialog?.type === 'reject'
                    ? 'bg-red-500 hover:bg-red-600'
                    : ''
                }
              >
                {confirmDialog?.type === 'reject' ? 'Reject' : 'Confirm Offer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </DndContext>
  );
}
