import { memo, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseButtonSimple } from '#/base/components/base-button-simple.component';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseInputDate } from '#/base/components/base-input-date.component';
import { BaseRadioGroup } from '#/base/components/base-radio.component';
import { BaseModal } from '#/base/components/base-modal.component';

import type { ChangeEvent, ComponentProps } from 'react';
import type { DateRange, QueryFilterOption } from '#/core/models/core.model';

type Props = ComponentProps<'div'> & {
  dateRangeOptions: QueryFilterOption[];
  defaultSelectedtDateRangeOption: QueryFilterOption;
  dateRange: DateRange;
  onPrint?: () => void;
  onDateRange?: (dateRange: DateRange) => void;
  onRefresh?: () => void;
};

export const ReportFranchisesActions = memo(function ({
  className,
  dateRangeOptions,
  defaultSelectedtDateRangeOption,
  dateRange,
  onPrint,
  onRefresh,
  onDateRange,
  ...moreProps
}: Props) {
  const [open, setOpen] = useState(false);

  const [customDateRange, setCustomDateRange] = useState(dateRange);

  const [selectedDateRangeOption, setSelectedDateRangeOption] =
    useState<QueryFilterOption>(defaultSelectedtDateRangeOption);

  const [currentSelectedDateRangeOption, setCurrentSelectedDateRangeOption] =
    useState<QueryFilterOption>(selectedDateRangeOption);

  const setDateRange = useCallback(() => {
    setCurrentSelectedDateRangeOption(selectedDateRangeOption);

    if (selectedDateRangeOption.value) {
      onDateRange && onDateRange(selectedDateRangeOption.value() as DateRange);
    } else {
      onDateRange && onDateRange(customDateRange);
    }
  }, [selectedDateRangeOption, customDateRange, onDateRange]);

  const handleOpenModal = useCallback(
    (open: boolean) => () => setOpen(open),
    [],
  );

  const handleCustomStartDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const startDate = dayjs(event.target.value).toDate();
      setCustomDateRange((prev) => ({ ...prev, startDate }));
    },
    [],
  );

  const handleCustomEndDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const endDate = dayjs(event.target.value).toDate();
      setCustomDateRange((prev) => ({ ...prev, endDate }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (selectedDateRangeOption.value == null) {
      if (
        !dayjs(customDateRange.startDate).isValid() ||
        !dayjs(customDateRange.endDate).isValid() ||
        dayjs(customDateRange.startDate).isAfter(dayjs(customDateRange.endDate))
      ) {
        toast.error('Invalid date range');
        return;
      }
    }

    setDateRange();
    handleOpenModal(false)();
  }, [selectedDateRangeOption, customDateRange, setDateRange, handleOpenModal]);

  useEffect(() => {
    setSelectedDateRangeOption(currentSelectedDateRangeOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <div className={cx('flex items-center gap-4', className)} {...moreProps}>
        {onPrint && <BaseButtonSimple iconName='printer' onClick={onPrint} />}
        {onDateRange && (
          <BaseButtonSimple
            iconName='funnel-simple'
            onClick={handleOpenModal(true)}
          />
        )}
        {onRefresh && (
          <BaseButtonSimple iconName='arrows-clockwise' onClick={onRefresh} />
        )}
      </div>
      {onDateRange && (
        <BaseModal title='Filters' open={open} onClose={handleOpenModal(false)}>
          <div className='flex flex-col items-center gap-5'>
            <div>
              <BaseRadioGroup
                className='relative z-10 ml-2 w-fit bg-[#222226] pl-2'
                value={selectedDateRangeOption}
                options={dateRangeOptions}
                aria-label='Date Range'
                onChange={setSelectedDateRangeOption}
              />
              <div className='-mt-3 flex items-center gap-4 rounded border border-border p-4 pt-6'>
                <BaseInputDate
                  label='Start Date'
                  value={dayjs(customDateRange.startDate).format('YYYY-MM-DD')}
                  min='1950-01-01'
                  max={dayjs().format('YYYY-MM-DD')}
                  onChange={handleCustomStartDateChange}
                />
                <BaseInputDate
                  label='End Date'
                  value={dayjs(customDateRange.endDate).format('YYYY-MM-DD')}
                  min='1950-01-01'
                  max={dayjs().format('YYYY-MM-DD')}
                  onChange={handleCustomEndDateChange}
                />
              </div>
            </div>
            <div className='w-full border-b border-border' />
            <div className='flex w-full items-center justify-end'>
              <BaseButton className='min-w-28' onClick={handleSubmit}>
                Apply
              </BaseButton>
            </div>
          </div>
        </BaseModal>
      )}
    </>
  );
});
