import { memo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import type { IconName } from '../models/base.model';
import cx from 'classix';

type Props = ComponentProps<'table'> & {
  columns: ColumnDef<any, any>[];
  data: unknown[];
};

export const BaseTable = memo(function ({
  className,
  columns,
  data,
  ...moreProps
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className='overflow-hidden rounded'>
      <table
        className={cx(
          'w-full border-collapse border border-border text-base',
          className,
        )}
        {...moreProps}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortIconName = {
                  asc: 'caret-up',
                  desc: 'caret-down',
                  false: 'caret-up-down',
                }[header.column.getIsSorted().toString()];

                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className='border-collapse border border-border bg-primary-button-hover/40 px-4 py-2.5'
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cx(
                          'flex w-full items-center gap-1',
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <div className='print-hidden'>
                            <BaseIcon
                              name={sortIconName as IconName}
                              size={18}
                              weight='fill'
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => (
              <tr key={row.id} className='even:bg-backdrop-input'>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='border-collapse border border-border px-4 py-2.5'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
});
