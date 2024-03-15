import toast from "react-hot-toast";

export const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
}