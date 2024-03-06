"use client";

import { Button } from "@nextui-org/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import toast, { Toaster, ToastBar } from "react-hot-toast";

const ToastContent = ({ children }: { children: React.ReactNode }) => (
  <div className="whitespace-nowrap text-xs xs:text-sm">{children}</div>
)

export default function ToastWrapper() {
  return (
    <Toaster
      position="bottom-right"
      containerStyle={{ zIndex: 200000 }}
      toastOptions={{ duration: Infinity, style: { maxWidth: "380px" } }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => {
            return (
            <>
              {icon}
              <ToastContent>
                {message}
              </ToastContent>
              {t.type !== "loading" && (
                <Button
                  className="h-full min-w-0 px-4 light"
                  size="lg"
                  variant="light"
                  onPress={() => toast.dismiss(t.id)}
                  isIconOnly
                >
                  <Cross2Icon className="flex-1rem" width="24" height="24" />
                </Button>
              )}
            </>
          )}}
        </ToastBar>
      )}
    </Toaster>
  );
}
