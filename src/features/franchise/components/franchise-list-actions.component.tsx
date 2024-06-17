import { memo, useCallback, useEffect, useState } from 'react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.component';
import { BaseButtonSimple } from '#/base/components/base-button-simple.component';
import { BaseCheckbox } from '#/base/components/base-checkbox.component';
import { BaseSearchInput } from '#/base/components/base-input-search.component';
import { BaseModal } from '#/base/components/base-modal.component';

import type { ComponentProps } from 'react';
import type { QueryFilterOption } from '#/core/models/core.model';

type Props = ComponentProps<'div'> & {
  options: QueryFilterOption[];
  defaultSelectedtOptions?: QueryFilterOption[];
  onSearchChange?: (value: string | null) => void;
  onFilter?: (options: QueryFilterOption[]) => void;
  onRefresh?: () => void;
};

export const FranchiseListActions = memo(function ({
  className,
  options,
  defaultSelectedtOptions,
  onSearchChange,
  onRefresh,
  onFilter,
  ...moreProps
}: Props) {
  const [open, setOpen] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<QueryFilterOption[]>(
    defaultSelectedtOptions || [],
  );

  const [currentSelectedOptions, setCurrentSelectedOptions] =
    useState<QueryFilterOption[]>(selectedOptions);

  const isChecked = useCallback(
    (option: QueryFilterOption) => {
      if (!selectedOptions.length) {
        return false;
      }
      return selectedOptions.some((sOption) => sOption.key === option.key);
    },
    [selectedOptions],
  );

  const handleOpenModal = useCallback(
    (open: boolean) => () => setOpen(open),
    [],
  );

  const handleOptionSelect = useCallback(
    (option: QueryFilterOption) => (checked: boolean) =>
      setSelectedOptions((prev) => {
        return !checked
          ? prev.filter((op) => op.key !== option.key)
          : [...prev, option];
      }),
    [],
  );

  const handleSelectClearAll = useCallback(() => {
    setSelectedOptions(options.length <= selectedOptions.length ? [] : options);
  }, [options, selectedOptions]);

  const handleSubmit = useCallback(() => {
    setCurrentSelectedOptions(selectedOptions);
    onFilter && onFilter(selectedOptions);
    handleOpenModal(false)();
  }, [selectedOptions, onFilter, handleOpenModal]);

  useEffect(() => {
    setSelectedOptions(currentSelectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <div className={cx('flex items-center gap-4', className)} {...moreProps}>
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
        {onRefresh && (
          <BaseButtonSimple iconName='arrows-clockwise' onClick={onRefresh} />
        )}
      </div>
      {onFilter && (
        <BaseModal title='Filters' open={open} onClose={handleOpenModal(false)}>
          <div className='flex flex-col items-center gap-5'>
            <div className='flex w-full max-w-52 flex-col gap-2.5 px-4'>
              {options.map((option) => (
                <BaseCheckbox
                  key={option.key}
                  checked={isChecked(option)}
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
