import cx from 'classix';
import { forwardRef, memo, useMemo } from 'react';

import dayjs from '#/config/dayjs.config';
import { FeeType } from '#/rate-sheet/models/rate-sheet.model';
import { RateSheetDetailsPrintView } from '#/rate-sheet/components/rate-sheet-details-print-view.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { RateSheet } from '#/rate-sheet/models/rate-sheet.model';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  rateSheets: RateSheet[];
};

const IMG_BASE_URL = `${import.meta.env.VITE_SUPABASE_BASE_URL}/passi_toda_mtop/static`;

export const FranchiseSinglePrintView = memo(
  forwardRef<HTMLDivElement, Props>(function (
    { className, franchise, rateSheets, ...moreProps },
    ref,
  ) {
    const [
      user,
      vehicleMake,
      vehicleMotorNo,
      vehicleChassisNo,
      plateNo,
      todaAssociation,
      approvalStatus,
      approvalDate,
      expiryDate,
      activeValidityMonths,
      isRenewal,
    ] = useMemo(() => {
      const target = franchise.franchiseRenewals.length
        ? franchise.franchiseRenewals[0]
        : franchise;

      return [
        franchise.user,
        franchise.vehicleMake.toUpperCase(),
        franchise.vehicleMotorNo.toUpperCase(),
        franchise.vehicleChassisNo.toUpperCase(),
        franchise.plateNo.toUpperCase(),
        target.todaAssociation,
        target.approvalStatus,
        target.approvalDate
          ? dayjs(target.approvalDate).format('MMMM DD, YYYY')
          : null,
        target.expiryDate
          ? dayjs(target.expiryDate).format('MMMM DD, YYYY')
          : null,
        dayjs(target.expiryDate).diff(target.approvalDate, 'months'),
        !!franchise.franchiseRenewals.length,
      ];
    }, [franchise]);

    const [todaName, todaAuthorizedRoute] = useMemo(
      () => [todaAssociation.name, todaAssociation.authorizedRoute],
      [todaAssociation],
    );

    const [ownerReverseFullName] = useMemo(
      () => [user?.userProfile.reverseFullName || ''],
      [user],
    );

    const headerTitle = useMemo(
      () => 'Franchise Confirmation/Verification',
      [],
    );

    const currentDate = useMemo(() => dayjs().format('MMMM DD, YYYY'), []);

    const numberOfUnits = useMemo(
      () => `One (1) Unit/s ${isRenewal ? 'Renewal' : 'Registration'}`,
      [isRenewal],
    );

    const paymentORNo = useMemo(() => {
      if (
        approvalStatus === FranchiseApprovalStatus.Canceled ||
        approvalStatus === FranchiseApprovalStatus.Rejected ||
        approvalStatus === FranchiseApprovalStatus.PendingValidation ||
        approvalStatus === FranchiseApprovalStatus.Validated
      )
        return undefined;

      return franchise.paymentORNo;
    }, [approvalStatus, franchise]);

    const currentRateSheet = useMemo(
      () =>
        rateSheets.find((rateSheet) => {
          const feeType = isRenewal
            ? FeeType.FranchiseRenewal
            : FeeType.FranchiseRegistration;
          return rateSheet.feeType === feeType;
        }),
      [rateSheets, isRenewal],
    );

    return (
      <div
        ref={ref}
        className={cx(
          'content-wrapper mx-auto flex w-full max-w-[800px] flex-col gap-2.5 rounded bg-white px-4 py-5 !font-serif text-black lg:px-20 lg:py-20',
          className,
        )}
        {...moreProps}
      >
        <div className='flex flex-col items-center gap-1.5 py-4 text-base leading-none'>
          <span>Republic of the Philippines</span>
          <span>Province of Iloilo</span>
          <span className='uppercase'>City of Passi</span>
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='flex-1 text-base font-bold uppercase'>
            {headerTitle}
          </h2>
          <span className='text-base'>{currentDate}</span>
        </div>
        <div className='mb-16 flex w-full flex-col items-start gap-1.5'>
          <div className='flex w-full justify-between'>
            <div className='text-base leading-none'>
              <div className='print-border inline-flex w-20 justify-between border-b'>
                <span>#</span>
                <span>Ord</span>
              </div>
              . # 2024-0
              <div className='print-border -mb-1 inline-block w-10 border-b' />
            </div>
            <div className='flex w-[205px] flex-col gap-1.5 text-sm'>
              <div className='flex'>
                <span>Local Plate Number:</span>
                <span className='print-border flex-1 border-b leading-none' />
              </div>
              <div className='flex leading-none'>
                <span>Date:</span>
                <span className='print-border inline-block flex-1 border-b pl-2'>
                  {currentDate}
                </span>
              </div>
            </div>
          </div>
          <div className='flex w-full flex-col gap-1.5 text-sm'>
            {/* Operator */}
            <div className='flex w-full items-center'>
              <div>
                <span className='inline-block w-[135px] leading-none'>
                  Name of Operator:{' '}
                </span>
              </div>
              <div className='print-border flex flex-1 justify-between border-b text-base font-bold uppercase leading-none'>
                <span>{ownerReverseFullName}</span>
                <div className='flex w-[205px]'>
                  <span>{`MTOP: 24-PAS-`}</span>
                </div>
              </div>
            </div>
            {/* Authority */}
            <div className='flex w-full items-center leading-none'>
              <div className='flex flex-1'>
                <span className='inline-block w-[135px]'>
                  Name of Authority:{' '}
                </span>
                <span className='print-border flex-1 border-b pl-2'>
                  // CPC //MTOP
                </span>
              </div>
              <div className='flex'>
                <div className='flex w-[205px]'>
                  <span>Validity Period: </span>
                  <span className='print-border inline-block flex-1 border-b pl-2'>
                    {`${activeValidityMonths} ${activeValidityMonths > 1 ? 'Months' : 'Month'}`}
                  </span>
                </div>
              </div>
            </div>
            {/* Dates */}
            <div className='flex w-full items-center leading-none'>
              <div className='flex flex-1'>
                <span className='inline-block w-[135px]'>Date Granted: </span>
                <span className='print-border flex-1 border-b pl-2'>
                  {approvalDate}
                </span>
              </div>
              <div className='flex'>
                <div className='flex w-[205px]'>
                  <span>Expiry Date: </span>
                  <span className='print-border inline-block flex-1 border-b pl-2'>
                    {expiryDate}
                  </span>
                </div>
              </div>
            </div>
            {/* Units */}
            <div className='flex w-full items-center leading-none'>
              <div className='flex flex-1'>
                <span className='inline-block w-[135px]'>
                  Authorized No. Of Unit:{' '}
                </span>
                <span className='print-border flex-1 border-b pl-2 leading-none'>
                  {numberOfUnits}
                </span>
              </div>
            </div>
            {/* Route */}
            <div className='flex w-full items-center leading-none'>
              <div className='flex flex-1'>
                <span className='inline-block w-[135px]'>
                  Authorized Route:{' '}
                </span>
                <span className='print-border flex-1 border-b pl-2 leading-none'>
                  {todaAuthorizedRoute}
                </span>
              </div>
            </div>
          </div>
          <div className='flex w-full items-start gap-x-8 pt-4'>
            <div className='flex flex-col gap-4 text-base uppercase'>
              <span>Make</span>
              <span>{vehicleMake}</span>
            </div>
            <div className='flex flex-col gap-4 text-base uppercase'>
              <span>Motor No.</span>
              <span>{vehicleMotorNo}</span>
            </div>
            <div className='flex flex-col gap-4 text-base uppercase'>
              <span>Chassis/Serial No.</span>
              <span>{vehicleChassisNo}</span>
            </div>
            <div className='flex flex-col gap-4 text-base uppercase'>
              <span>Plate No.</span>
              <span>{plateNo}</span>
            </div>
          </div>
        </div>
        {currentRateSheet && (
          <RateSheetDetailsPrintView
            rateSheet={currentRateSheet}
            paymentDate={approvalDate || undefined}
            paymentORNo={paymentORNo}
          />
        )}
        <div className='flex w-full flex-col gap-5'>
          <h4 className='text-sm font-bold uppercase leading-none'>
            Recommending Approval:
          </h4>
          <div className='flex w-full justify-between gap-2.5'>
            <div className='relative flex flex-col gap-0.5'>
              <img
                className='absolute -top-12 left-1/2 w-32 -translate-x-1/2'
                src={`${IMG_BASE_URL}/sign-palmes.png`}
                alt='sign-palmes'
              />
              <span className='text-base font-bold uppercase'>
                Mariano P. Palmes
              </span>
              <div className='flex flex-col gap-1 text-sm leading-none'>
                <span className='!text-base !leading-none'>
                  Executive Assistant I
                </span>
                <span>POSTMS</span>
                <span>Passi City, Iloilo</span>
              </div>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-base font-bold uppercase'>
                Paquito J. Estandarte Jr.
              </span>
              <div className='flex flex-col text-center text-base leading-none'>
                <span>City Treasurer</span>
              </div>
            </div>
          </div>
          <div className='mx-auto flex max-w-full flex-col items-center gap-10'>
            <div className='relative flex flex-col gap-0.5 pb-6 text-center'>
              <img
                className='absolute -top-6 left-1/2 w-16 -translate-x-1/2 opacity-90'
                src={`${IMG_BASE_URL}/sign-padilla.png`}
                alt='sign-padilla'
              />
              <span className='text-base font-bold uppercase'>
                Jason P. Padilla
              </span>
              <div className='flex flex-col text-center text-base leading-none'>
                <span>City Gov't. Dept. Head I</span>
              </div>
            </div>
            <div className='flex flex-col gap-0.5 text-center'>
              <span className='text-base font-bold uppercase'>
                Atty. Stephen A. Palmares, CPA
              </span>
              <div className='flex flex-col gap-1 text-center text-base leading-none'>
                <span>City Mayor</span>
              </div>
            </div>
            <span className='text-base uppercase'>
              By Authority of the City Mayor:
            </span>
            <div className='relative flex flex-col gap-0.5 text-center'>
              <img
                className='absolute -top-6 left-1/2 w-16 -translate-x-1/2'
                src={`${IMG_BASE_URL}/sign-palma.png`}
                alt='sign-palma'
              />
              <span className='text-base font-bold uppercase'>
                Renz Carlo P. Palma
              </span>
              <div className='flex flex-col gap-1 text-center text-base leading-none'>
                <span>SP Member/Chairman- Committee on Transportation</span>
                <span>And Communication</span>
              </div>
            </div>
          </div>
          <div className='text-base'>{todaName}</div>
        </div>
      </div>
    );
  }),
);
