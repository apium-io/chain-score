import { Contract } from "../types/submit-transaction-type";

export async function submitTransactionService(contract: Contract) {
    const { toCompanyId, fromCompanyId, monthlyAmount, paymentCycleTime } = contract;

}