import toast from "react-hot-toast";
import { BaseError, ContractFunctionRevertedError } from "viem";

/**
 * Logs viem errors when writing to contracts, and creates a toast notification with an error message.
 * @param error The error to handle.
 * @param toastId An optional ID for the toast notification.
 */
export default function handleViemContractError(error: any, toastId?: string) {
  console.log(error);
  let description = "Failed to create the transaction.";
  if (error instanceof BaseError) {
    // Default to short message
    description = error.shortMessage;

    const revertError: ContractFunctionRevertedError = error.walk(
      (e) => e instanceof ContractFunctionRevertedError,
    ) as ContractFunctionRevertedError;
    if (revertError) {
      description = description + ` Decoded error name: "${revertError.data?.errorName}"`;
    }
  }

  // Display to the user
  toast.error(description, { id: toastId });
}
