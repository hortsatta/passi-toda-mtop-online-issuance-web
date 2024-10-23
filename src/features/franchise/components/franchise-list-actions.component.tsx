import { memo, useCallback, useEffect, useState } from 'react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.component';
import { BaseButtonSimple } from '#/base/components/base-button-simple.component';
import { BaseCheckbox } from '#/base/components/base-checkbox.component';
import { BaseSearchInput } from '#/base/components/base-input-search.component';
import { BaseModal } from '#/base/components/base-modal.component';

import type { ComponentProps } from 'react';
import type { QueryFilterOption } from '#/core/models/core.model';
import type { ListView } from '#/base/models/base.model';

type Props = ComponentProps<'div'> & {
  filterOptions?: QueryFilterOption[];
  listView?: ListView;
  defaultSelectedtFilterOptions?: QueryFilterOption[];
  onSearchChange?: (value: string | null) => void;
  onFilter?: (options: QueryFilterOption[]) => void;
  onRefresh?: () => void;
  onListViewChange?: () => void;
};

export const FranchiseListActions = memo(function ({
  className,
  listView = 'strip',
  filterOptions,
  defaultSelectedtFilterOptions,
  onSearchChange,
  onFilter,
  onRefresh,
  onListViewChange,
  ...moreProps
}: Props) {
  const [open, setOpen] = useState(false);

  const [selectedFilterOptions, setSelectedFilterOptions] = useState<
    QueryFilterOption[]
  >(defaultSelectedtFilterOptions || []);

  const [currentSelectedFilterOptions, setCurrentSelectedFilterOptions] =
    useState<QueryFilterOption[]>(selectedFilterOptions);

  const isFilterChecked = useCallback(
    (option: QueryFilterOption) => {
      if (!selectedFilterOptions.length) {
        return false;
      }
      return selectedFilterOptions.some(
        (selectedOption) => selectedOption.key === option.key,
      );
    },
    [selectedFilterOptions],
  );

  const handleOpenModal = useCallback(
    (open: boolean) => () => setOpen(open),
    [],
  );

  const handleOptionSelect = useCallback(
    (option: QueryFilterOption) => (checked: boolean) =>
      setSelectedFilterOptions((prev) => {
        return !checked
          ? prev.filter((op) => op.key !== option.key)
          : [...prev, option];
      }),
    [],
  );

  const handleSelectClearAll = useCallback(() => {
    setSelectedFilterOptions(
      (filterOptions?.length || 0) <= selectedFilterOptions.length
        ? []
        : (filterOptions as QueryFilterOption[]),
    );
  }, [filterOptions, selectedFilterOptions]);

  const handleSubmit = useCallback(() => {
    setCurrentSelectedFilterOptions(selectedFilterOptions);
    onFilter && onFilter(selectedFilterOptions);
    handleOpenModal(false)();
  }, [selectedFilterOptions, onFilter, handleOpenModal]);

  useEffect(() => {
    setSelectedFilterOptions(currentSelectedFilterOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <div
        className={cx('flex w-full items-center gap-4 sm:w-auto', className)}
        {...moreProps}
      >
        {onSearchChange && (
          <BaseSearchInput
            iconName='magnifying-glass'
            onChange={onSearchChange}
          />
        )}
        {onFilter && (
          <BaseButtonSimple
            iconName='funnel-simple'
            onClick={handleOpenModal(true)}
          />
        )}
        {onListViewChange && (
          <BaseButtonSimple
            iconName={listView === 'strip' ? 'rows' : 'squares-four'}
            onClick={onListViewChange}
          />
        )}
        {onRefresh && (
          <BaseButtonSimple iconName='arrows-clockwise' onClick={onRefresh} />
        )}
      </div>
      {onFilter && (
        <BaseModal title='Filters' open={open} onClose={handleOpenModal(false)}>
          <div className='flex flex-col items-center gap-5'>
            <div className='flex w-full max-w-52 flex-col gap-2.5 px-4'>
              {filterOptions?.map((option) => (
                <BaseCheckbox
                  key={option.key}
                  checked={isFilterChecked(option)}
                  onChange={handleOptionSelect(option)}
                >
                  {option.label}
                </BaseCheckbox>
              ))}
            </div>
            <div className='w-full border-b border-border' />
            <div className='flex w-full items-center justify-between'>
              <div className='flex flex-col justify-center gap-2'>
                <BaseButtonSimple
                  iconName='check-square-offset'
                  onClick={handleSelectClearAll}
                >
                  Select / Clear All
                </BaseButtonSimple>
              </div>
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
