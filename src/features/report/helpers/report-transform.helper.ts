import type { ReportFranchiseIssuance } from '../models/report.model';

export function transformToReportFranchiseIssuance({
  totalApplicationCount,
  totalPendingValidationCount,
  totalPendingPaymentCount,
  totalApprovalCount,
  totalRejectedCount,
  totalCanceledCount,
}: any): ReportFranchiseIssuance {
  return {
    totalApplicationCount,
    totalPendingValidationCount,
    totalPendingPaymentCount,
    totalApprovalCount,
    totalRejectedCount,
    totalCanceledCount,
  };
}
