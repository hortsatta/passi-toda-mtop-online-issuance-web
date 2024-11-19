import isBase64 from 'validator/lib/isBase64';

import { PDF_FILE_EXT, IMG_FILE_EXT } from '#/base/helpers/base-file.helper';

import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

export async function generateImageFormData(
  data: FranchiseUpsertFormData,
): Promise<FormData> {
  const { plateNo } = data;

  const items = [
    { imageData: data.vehicleORImgUrl, name: 'vehicleORImgUrl-vehicle_or' },
    { imageData: data.vehicleCRImgUrl, name: 'vehicleCRImgUrl-vehicle_cr' },
    {
      imageData: data.todaAssocMembershipImgUrl,
      name: 'todaAssocMembershipImgUrl-toda_assoc_membership',
    },
    {
      imageData: data.driverLicenseNoImgUrl,
      name: 'driverLicenseNoImgUrl-owner_driver_license_no',
    },
    {
      imageData: data.brgyClearanceImgUrl,
      name: 'brgyClearanceImgUrl-brgy_clearance',
    },
    {
      imageData: data.ctcCedulaImgUrl,
      name: 'ctcCedulaImgUrl-ctc_cedula',
    },
    {
      imageData: data.voterRegRecordImgUrl,
      name: 'voterRegRecordImgUrl-voter_reg_record',
    },
  ];

  const formData = new FormData();
  const files: { base64: string; filename: string }[] = [];

  items.forEach(({ imageData, name }) => {
    const target = imageData?.split(',') || [];

    if (!imageData || !isBase64([...target].pop() || '')) return;

    const fileExt = [...target].shift()?.includes(PDF_FILE_EXT)
      ? PDF_FILE_EXT
      : IMG_FILE_EXT;

    const filename = `${plateNo.toLowerCase()}-${name}.${fileExt}`;

    files.push({ base64: imageData, filename });
  });

  // Convert base64 to blob and append files to formData
  for (const { base64, filename } of files) {
    const blob = await (await fetch(base64)).blob();
    formData.append('files', blob, filename);
  }

  return formData;
}

export const driverProfileSelectOptions = [
  {
    label: 'Add New',
    value: 'add-new',
  },
  {
    label: 'Same as Owner',
    value: 'driver-owner',
  },
];
