import { memo } from 'react';
import cx from 'classix';

import { BaseButtonSimple } from '#/base/components/base-button-simple.component';
import { BaseSearchInput } from '#/base/components/base-input-search.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  onSearchChange?: (value: string | null) => void;
  onRefresh?: () => void;
};

export const TodaAssociationListActions = memo(function ({
  className,
  onSearchChange,
  onRefresh,
  ...moreProps
}: Props) {
  return (
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
      {onRefresh && (
        <BaseButtonSimple iconName='arrows-clockwise' onClick={onRefresh} />
      )}
    </div>
  );
});
