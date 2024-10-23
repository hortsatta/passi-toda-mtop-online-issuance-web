import { forwardRef, memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseTable } from '#/base/components/base-table.component';

import type { ComponentProps } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { DateRange } from '#/core/models/core.model';
import type { ReportFranchiseIssuance } from '../models/report.model';

type Props = ComponentProps<'div'> & {
  reportFranchiseIssuance: ReportFranchiseIssuance;
  dateRange: DateRange;
};

type ReportFranchiseIssuanceHeader = {
  franchiseRegistrationStatus: string;
  total: number;
};

export const ReportFranchiseIssuanceTable = memo(
  forwardRef<HTMLDivElement, Props>(function (
    { className, reportFranchiseIssuance, dateRange, ...moreProps },
    ref,
  ) {
    const [startDateText, endDateText] = useMemo(
      () => [
        dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      ],
      [dateRange],
    );

    const columns = useMemo<ColumnDef<ReportFranchiseIssuanceHeader>[]>(
      () => [
        {
          accessorFn: (row) => row.franchiseRegistrationStatus,
          id: 'franchiseRegistrationStatus',
          header: () => <span>Franchise Registrations</span>,
        },
        {
          accessorFn: (row) => row.total,
          id: 'total',
          header: () => <span className='flex-1 text-right'>Total</span>,
          cell: (info) => (
            <span className='block text-right'>
              {info.getValue() as number}
            </span>
          ),
        },
      ],
      [],
    );

    const data = useMemo(
      () => [
        {
          franchiseRegistrationStatus: 'Registered applications',
          total: reportFranchiseIssuance.totalApplicationCount,
        },
        {
          franchiseRegistrationStatus: 'Franchises approved and issued',
          total: reportFranchiseIssuance.totalApprovalCount,
        },
        {
          franchiseRegistrationStatus: 'Applications approved for payment',
          total: reportFranchiseIssuance.totalPendingPaymentCount,
        },
        {
          franchiseRegistrationStatus: 'Applications pending for validation',
          total: reportFranchiseIssuance.totalPendingValidationCount,
        },
        {
          franchiseRegistrationStatus: 'Rejected applications',
          total: reportFranchiseIssuance.totalRejectedCount,
        },
        {
          franchiseRegistrationStatus: 'Canceled applications',
          total: reportFranchiseIssuance.totalCanceledCount,
        },
      ],
      [reportFranchiseIssuance],
    );

    return (
      <div
        ref={ref}
        className={cx(
          'table-wrapper flex flex-col gap-5 bg-backdrop-surface px-4 py-5 lg:px-16 lg:py-12',
          className,
        )}
        {...moreProps}
      >
        <p className='text-lg'>
          Showing registrations from{' '}
          <span className='font-bold'>{startDateText}</span> to{' '}
          <span className='font-bold'>{endDateText}</span>
        </p>
        <BaseTable columns={columns} data={data} />
      </div>
    );
  }),
);
