"use client";

import { Button } from "@nextui-org/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import toast, { Toaster, ToastBar } from "react-hot-toast";

export default function ToastWrapper() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{ duration: Infinity, style: { maxWidth: "400px" } }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
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
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
