import isBase64 from 'validator/lib/isBase64';

import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

export async function generateImageFormData(
  data: FranchiseUpsertFormData,
): Promise<FormData> {
  const { mvFileNo } = data;

  const items = [
    { imageData: data.vehicleORImgUrl, name: 'vehicleORImgUrl-vehicle_or' },
    { imageData: data.vehicleCRImgUrl, name: 'vehicleCRImgUrl-vehicle_cr' },
    {
      imageData: data.todaAssocMembershipImgUrl,
      name: 'todaAssocMembershipImgUrl-toda_assoc_membership',
    },
    {
      imageData: data.ownerDriverLicenseNoImgUrl,
      name: 'ownerDriverLicenseNoImgUrl-owner_driver_license_no',
    },
    {
      imageData: data.brgyClearanceImgUrl,
      name: 'brgyClearanceImgUrl-brgy_clearance',
    },
    {
      imageData: data.voterRegRecordImgUrl,
      name: 'voterRegRecordImgUrl-voter_reg_record',
    },
  ];

  const formData = new FormData();
  const files: { base64: string; filename: string }[] = [];
  const fileExt = 'png';

  items.forEach(({ imageData, name }) => {
    if (!imageData || !isBase64(imageData.split(',').pop() || '')) return;

    const filename = `${mvFileNo}-${name}.${fileExt}`;
    files.push({ base64: imageData, filename });
  });

  // Convert base64 to blob and append files to formData
  for (const { base64, filename } of files) {
    const blob = await (await fetch(base64)).blob();
    formData.append('files', blob, filename);
  }

  return formData;
}
