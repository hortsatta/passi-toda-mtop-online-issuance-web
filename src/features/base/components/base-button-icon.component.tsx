import { forwardRef, memo } from 'react';
import cx from 'classix';

import { BaseButton } from './base-button.component';
import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<typeof BaseButton> & {
  iconName: IconName;
};

export const BaseButtonIcon = memo(
  forwardRef<any, Props>(function ({ className, iconName, ...moreProps }, ref) {
    return (
      <BaseButton
        ref={ref}
        className={cx('!w-14 !px-0', className)}
        {...moreProps}
      >
        <BaseIcon name={iconName} size={24} />
      </BaseButton>
    );
  }),
);
