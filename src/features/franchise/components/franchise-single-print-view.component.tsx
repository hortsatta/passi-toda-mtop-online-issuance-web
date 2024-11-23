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

    const [ownerReverseFullName, ownerAddress] = useMemo(
      () => [
        user?.userProfile.reverseFullName || '',
        user?.userProfile.address,
      ],
      [user],
    );

    const headerTitle = useMemo(
      () => 'Franchise Confirmation/Verification',
      [],
    );

    const [currentDate, formalDate] = useMemo(
      () => [
        dayjs().format('MMMM DD, YYYY'),
        dayjs().format('Do [day of] MMMM YYYY'),
      ],
      [],
    );

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
          'mx-auto flex w-full max-w-[800px] flex-col gap-2.5 rounded !font-serif text-black',
          className,
        )}
        {...moreProps}
      >
        <div className='content-wrapper mx-auto flex w-full flex-col gap-2.5 rounded bg-white px-4 py-5 lg:px-20 lg:py-20'>
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
              <div className='flex w-[205px] flex-col gap-1.5'>
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
        <div className='break-after-page' />
        {/* Page 2 */}
        <div className='content-wrapper mx-auto flex w-full flex-col gap-2.5 rounded bg-white px-4 py-5 lg:px-20 lg:py-20'>
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
            <div className='flex flex-col gap-8 text-base'>
              <span>{todaName}</span>
              <span className='font-bold uppercase'>Note: For TC</span>
            </div>
          </div>
        </div>
        <div className='break-after-page' />
        {/* Page 3 */}
        <div className='content-wrapper mx-auto flex w-full flex-col gap-2.5 rounded bg-white px-4 py-5 lg:px-20 lg:py-20'>
          <div className='flex flex-col items-center gap-1.5 py-4 text-base leading-none'>
            <span>Republic of the Philippines</span>
            <span>Province of Iloilo</span>
            <span className='uppercase'>City of Passi</span>
          </div>
          <div className='flex flex-col pb-2.5 text-[13px]'>
            <span>Application for issuance of</span>
            <span>Motorized Tricycle Operator's Permit to</span>
            <span>Operate an MCH Service</span>
          </div>
          <div className='flex flex-col'>
            <div className='flex w-fit flex-col text-base uppercase'>
              <span className='print-border border-b font-bold leading-none'>
                {ownerReverseFullName}
              </span>
              <span>Applicant</span>
            </div>
            <div className='flex w-[200px] flex-col self-end text-base uppercase leading-none'>
              <div className='flex'>
                <span>MTC</span>
                <span className='print-border flex-1 border-b text-center font-bold'>
                  24-PAS-
                </span>
              </div>
              <span className='pl-14 uppercase leading-none'>Case</span>
            </div>
            <div className='flex list-decimal flex-col pb-4 text-[13px]'>
              <span className='inline-block w-full text-center text-base uppercase leading-none'>
                Application
              </span>
              <span>
                APPLICANT, who this Honorable Office, most respectfully alleges:
              </span>
              <span>
                1. That the applicant is of legal age, Filipino and a resident
                of {ownerAddress}
              </span>
              <span>
                2. That applicant proposes to operate an MTC service on the
                route: with the use of one (1) unit/s more particularly
                described as follows:
              </span>
              <div className='flex w-full items-start gap-x-8 py-4'>
                <div className='flex flex-col text-base uppercase'>
                  <span>Make</span>
                  <span>{vehicleMake}</span>
                </div>
                <div className='flex flex-col text-base uppercase'>
                  <span>Motor No.</span>
                  <span>{vehicleMotorNo}</span>
                </div>
                <div className='flex flex-col text-base uppercase'>
                  <span>Chassis/Serial No.</span>
                  <span>{vehicleChassisNo}</span>
                </div>
                <div className='flex flex-col text-base uppercase'>
                  <span>Plate No.</span>
                  <span>{plateNo}</span>
                </div>
              </div>
              <span>
                3. That the applicant is both financially and operationally
                capable to operate and maintain the proposed service.
              </span>
              <span>
                4. That applicant is willing to abide the existing rules and
                regulations and those that the City may promulgate From time to
                time.
              </span>
              <span>
                5. That the public necessity demands the operation of the
                service applied for.
              </span>
              <div className='flex flex-col gap-4 pt-4 text-[13px]'>
                <span>
                  WHEREFORE, it is respectfully prayed of this Honorable Office,
                  that after due hearing, a Motorized Tricycle Operator's Permit
                  (MTOP) be issued in the favor of the applicant.
                </span>
                <span>Other remedies are likewise prayed for:</span>
                <span>
                  Passi City, Iloilo, Philippines this{' '}
                  <span className='print-border border-b leading-none'>
                    {formalDate}
                  </span>
                </span>
                <div className='flex w-fit flex-col self-end text-base uppercase'>
                  <span className='print-border border-b font-bold leading-none'>
                    {ownerReverseFullName}
                  </span>
                  <span>Affiant</span>
                </div>
              </div>
            </div>
            <div className='flex w-fit flex-col gap-0.5 pb-4 text-sm uppercase leading-none'>
              <span className='print-border border-b'>
                Republic of the Philippines
              </span>
              <span>Province of Iloilo S.S</span>
              <span className='print-border inline-block w-fit border-b'>
                City of Passi
              </span>
            </div>
            <div className='flex flex-col gap-4 text-[13px]'>
              <span>
                <span className='print-border border-b font-bold uppercase'>
                  I, {ownerReverseFullName},
                </span>{' '}
                of legal age, Filipino citizen, and a resident{' '}
                <span className='print-border border-b'>{ownerAddress}.</span>
              </span>
              <span>That I am the applicant in the above entitled case;</span>
              <span>
                That I have caused the preparation of the foregoing application
                and that all the allegations contained therein are true and
                correct to the best of my own personal knowledge and belief.{' '}
              </span>
              <div className='flex w-fit flex-col self-end text-base uppercase'>
                <span className='print-border border-b font-bold leading-none'>
                  {ownerReverseFullName}
                </span>
                <span>Affiant</span>
              </div>
              <div className='flex flex-col'>
                <span>
                  SUBSCRIBED AND SWORN to before me this{' '}
                  <span className='print-border border-b leading-none'>
                    {formalDate}.
                  </span>
                </span>
                <span>
                  Philippines, Affiant exhibited to me her/his Community Tax.
                  Certificate No.{' '}
                  <span className='print-border inline-block w-40 border-b leading-none' />
                </span>
                <span>
                  Issued at{' '}
                  <span className='print-border inline-block w-40 border-b leading-none' />{' '}
                  on{' '}
                  <span className='print-border inline-block w-40 border-b leading-none' />
                </span>
                <span>
                  TIN No.{' '}
                  <span className='print-border inline-block w-60 border-b leading-none' />
                  .
                </span>
              </div>
              <div className='flex w-fit flex-col justify-center gap-4 self-end'>
                <div className='flex flex-col gap-0.5 text-center'>
                  <span className='text-base font-bold uppercase'>
                    Atty. Stephen A. Palmares, CPA
                  </span>
                  <div className='flex flex-col gap-1 text-center text-base leading-none'>
                    <span>City Mayor</span>
                  </div>
                </div>
                <span className='text-center text-base uppercase'>
                  By Authority of the City Mayor:
                </span>
                <div className='relative flex w-fit flex-col gap-0.5 text-center'>
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
            </div>
          </div>
        </div>
        <div className='break-after-page' />
        {/* Page 4 */}
        <div className='content-wrapper mx-auto flex w-full flex-col gap-2.5 rounded bg-white px-4 py-5 lg:px-20 lg:py-20'>
          <div className='flex flex-col items-center gap-1.5 py-4 text-base leading-none'>
            <span>Republic of the Philippines</span>
            <span>Province of Iloilo</span>
            <span className='uppercase'>City of Passi</span>
          </div>
          <div className='flex flex-col items-center pb-2.5'>
            <h2 className='flex-1 text-base font-bold uppercase'>
              MOTORIZED TRICYCLE OPERATOR'S PERMIT FOR MCH-SERVICE
            </h2>
          </div>
          <div className='flex flex-col gap-0.5'>
            {/* Operator */}
            <div className='flex w-full items-center'>
              <div>
                <span className='inline-block leading-none'>
                  Name of Operator:{' '}
                </span>
              </div>
              <div className='print-border flex flex-1 justify-between border-b pl-2 text-base font-bold uppercase leading-none'>
                <span>{ownerReverseFullName}</span>
                <div className='flex w-[205px]'>
                  <span>{`24-PAS-`}</span>
                </div>
              </div>
            </div>
            {/* Address */}
            <div className='flex w-full items-center leading-none'>
              <div className='flex flex-1'>
                <span className='inline-block'>Address: </span>
                <span className='print-border flex-1 border-b pl-2 leading-none'>
                  {ownerAddress}
                </span>
              </div>
            </div>
            {/* Route */}
            <div className='flex w-full items-center leading-none'>
              <div className='flex flex-1'>
                <span className='inline-block'>Route/Area of Operation: </span>
                <span className='print-border flex-1 border-b pl-2 leading-none'>
                  {todaAuthorizedRoute}
                </span>
              </div>
            </div>
            <span>
              Applicant/Operator is hereby authorized to operate of on One (1)
              unit/s more particularly described below.
            </span>
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
          <div className='flex flex-col gap-4 py-2.5 text-sm'>
            <span>Subject to the following</span>
            <div>
              <span className='print-border mx-auto block w-fit border-b text-center font-bold uppercase leading-none'>
                Conditions
              </span>
              <ul className='flex list-inside list-decimal flex-col gap-4'>
                <li>
                  Applicant shall register the herein authorized unit/s under
                  motorized tricycle denomination with the Land Transportation
                  Office (LTO) within thirty (30) days receipt hereof. The said
                  Agency shall cause the inspection of Applicants unit/s and
                  accept it/them for registration only if found roadworthy and
                  fit for operation for public service.
                </li>
                <li>
                  Applicant shall paint the corresponding Case Number of the
                  front, right back side and inside of the unit which shall not
                  be less than three (3) inches high. The route of operation
                  shall be also painted on front side below the LTFRB Case
                  Number not less than 1 ½ inches high.
                </li>
                <li>
                  MCH Operator shall charge the following authorized rates:
                  REGULAR{' '}
                  <span className='print-border inline-block w-24 border-b' />{' '}
                  for the first Kilometre and{' '}
                  <span className='print-border inline-block w-24 border-b' />{' '}
                  for every succeeding kilometre and{' '}
                  <span className='print-border inline-block w-24 border-b' />{' '}
                  for every Succeeding kilometre in no case shall fare lower or
                  higher than these authorized by the City be charged without
                  previous authority from the Office.
                </li>
                <li>
                  Applicant shall pay to this City on or before the anniversary
                  date of the MTOP.
                </li>
                <li>
                  The MOTORIZED TRICYCLE OPERATOR'S PERMIT herein granted shall
                  be valid for one (1) year from date hereof.
                </li>
                <li>
                  Applicant in the operation of this service shall strictly
                  observe and comply with all the rules and regulations of the
                  office, City Ordinance, Traffic Regulations and all of the
                  Philippines applicable to this service.
                </li>
              </ul>
            </div>
          </div>
          <div className='flex flex-col gap-4 pb-8 uppercase'>
            <span>So, Ordered</span>
            <span>Entered, Passi City, Iloilo</span>
          </div>
          <div className='flex justify-between text-[13px]'>
            <div className='flex flex-col'>
              <span className='uppercase leading-none'>Copy Furnished</span>
              <span>Applicant</span>
              <span>The Registrar, LTO </span>
            </div>
            <div className='flex w-fit flex-col justify-center gap-4 self-end'>
              <div className='flex flex-col gap-0.5 text-center'>
                <span className='text-base font-bold uppercase'>
                  Atty. Stephen A. Palmares, CPA
                </span>
                <div className='flex flex-col gap-1 text-center text-base leading-none'>
                  <span>City Mayor</span>
                </div>
              </div>
              <span className='text-center text-base uppercase'>
                By Authority of the City Mayor:
              </span>
              <div className='relative flex w-fit flex-col gap-0.5 text-center'>
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
          </div>
        </div>
      </div>
    );
  }),
);
