import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';
import { BaseFieldText } from '#/base/components/base-field-text.component';

import type { ComponentProps } from 'react';
import type { TodaAssociation } from '../models/toda-association.model';

type Props = ComponentProps<'div'> & {
  todaAssociation: TodaAssociation;
  loading?: boolean;
  viewOnly?: boolean;
};

export const TodaAssociationSingle = memo(function ({
  className,
  todaAssociation,
  viewOnly,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const { name, authorizedRoute, presidentReverseFullName, franchiseCount } =
    useMemo(() => todaAssociation, [todaAssociation]);

  const handleEditClick = useCallback(() => {
    navigate(routeConfig.todaAssociation.edit.to);
  }, [navigate]);

  const handleFranchiseView = useCallback(() => {
    navigate(routeConfig.todaAssociation.franchise.to);
  }, [navigate]);

  return (
    <div
      className={cx(
        'relative flex w-full flex-col gap-6 rounded bg-backdrop-surface px-4 py-5 lg:px-16 lg:py-12',
        className,
      )}
      {...moreProps}
    >
      <div className='absolute right-4 top-4 flex items-center gap-2.5'>
        <BaseButton onClick={handleFranchiseView}>View Franchises</BaseButton>
        {!viewOnly && (
          <BaseButtonIcon iconName='pencil-simple' onClick={handleEditClick} />
        )}
      </div>

      <div className='flex w-full flex-1 flex-col gap-4'>
        <h4>Association Info</h4>
        <div className='flex flex-1 flex-col gap-4'>
          <BaseFieldText label='Association Name'>{name}</BaseFieldText>
          <BaseFieldText label='Authorized Route'>
            {authorizedRoute}
          </BaseFieldText>
          <BaseFieldText label='Registered Franchises'>
            {franchiseCount}
          </BaseFieldText>
        </div>
      </div>
      <div className='flex w-full flex-1 flex-col gap-4'>
        <h4>More Info</h4>
        <div className='flex flex-1 gap-4'>
          <BaseFieldText label='President'>
            {presidentReverseFullName}
          </BaseFieldText>
        </div>
      </div>
    </div>
  );
});
