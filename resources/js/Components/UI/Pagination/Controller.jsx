import React from 'react';
import { router } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

export default function Controller({ value, preserveStateBool, preserveScrollBool }) {
  if (!value.links) return null;

    const handleClick = (url) => {
        router.visit(url, {
            preserveState: preserveStateBool,
            preserveScroll: preserveScrollBool,
        });
    };

  return (
    <nav
      className="mt-6 flex items-center justify-center space-x-1"
      aria-label="Pagination"
    >
      {/* Previous button */}
      <button
        onClick={() => handleClick(value.prev_page_url)}
        disabled={!value.prev_page_url}
        className={`px-2 py-1 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed
          ${value.prev_page_url ? 'bg-white hover:bg-gray-100' : 'bg-gray-50'}`}
        aria-label=""
      >
        <ChevronLeftIcon size={20} />
      </button>

      {/* Page links */}
      {value.links.map((link, i) => {
        // Render ellipsis
        if (link.label === '...') {
          return (
            <span
              key={i}
              className="px-3 py-1 rounded-md border bg-white text-gray-500"
            >
              <MoreHorizontalIcon size={16} />
            </span>
          );
        }

        const isActive = link.active;
        const label = Number.isNaN(+link.label) ? link.label : +link.label;
        return (
          <button
            key={i}
            onClick={() => link.url && handleClick(link.url)}
            dangerouslySetInnerHTML={{ __html: link.label }}
            className={`px-3 py-1 rounded-md border transition
              ${isActive
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-white text-blue-600 hover:bg-blue-50'}
            `}
            aria-current={isActive ? 'page' : undefined}
          />
        );
      })}

      {/* Next button */}
      <button
        onClick={() => handleClick(value.next_page_url)}
        disabled={!value.next_page_url}
        className={`px-2 py-1 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed
          ${value.next_page_url ? 'bg-white hover:bg-gray-100' : 'bg-gray-50'}`}
        aria-label=""
      >
        <ChevronRightIcon size={20} />
      </button>
    </nav>
  );
}
