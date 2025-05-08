'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  ClipboardCheck,
  FileCheck,
  FileX,
  PersonStanding,
  Star,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function ApplicationTimeline({ timelineData }: { timelineData: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const formatEventDate = (date: Date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy h:mm a');
  };

  const getEventIcon = (event: any) => {
    if (event.type === 'interview') {
      return event.result?.toLowerCase().includes('pass') ? (
        <ClipboardCheck className="text-green-600" />
      ) : (
        <FileX className="text-red-600" />
      );
    } else if (event.type === 'assessment') {
      return event.result?.toLowerCase().includes('pass') ? (
        <FileCheck className="text-green-600" />
      ) : (
        <FileX className="text-red-600" />
      );
    }
    return <PersonStanding />;
  };

  const renderRating = (rating: number) => {
    if (!rating) return null;

    return (
      <div className="mt-1 flex space-x-1">
        {Array(rating)
          .fill(null)
          .map((_, i) => (
            <Star key={i} className="bg text-yellow-400" size={16} />
          ))}
      </div>
    );
  };

  // Calculate pagination values
  const totalItems = timelineData ? timelineData.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const currentItems = timelineData
    ? timelineData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  // Handler for pagination
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Application Events</CardTitle>
        <CardDescription>
          Latest interviews and assessments for applicants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalItems > 0 ? (
          <>
            <ul className="grid gap-3 space-y-4 lg:grid-cols-3">
              {currentItems.map((event: any, index: number) => (
                <li key={index} className="rounded border p-4">
                  <div className="flex items-center space-x-3">
                    <div>{getEventIcon(event)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {event.eventName}{' '}
                        {event.result && (
                          <span className="text-sm text-gray-600">
                            ({event.result})
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {event.candidateName} &lt;{event.candidateEmail}&gt;
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatEventDate(event.date)}
                        {event.interviewer && (
                          <> | Interviewer: {event.interviewer}</>
                        )}
                        {event.dueDate && (
                          <>
                            {' '}
                            | Due:{' '}
                            {format(new Date(event.dueDate), 'MMM dd, yyyy')}
                          </>
                        )}
                      </p>
                      {event.remarks && (
                        <blockquote className="mt-1 text-gray-600 italic">
                          "{event.remarks}"
                        </blockquote>
                      )}
                      {renderRating(event.rating)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {Array(totalPages)
                    .fill(null)
                    .map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p>No recent events to display</p>
        )}
      </CardContent>
    </Card>
  );
}
