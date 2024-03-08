import { Card, CardBody } from "@nextui-org/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

export default function WarningCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`bg-warning-50 ${className || ""}`}>
      <CardBody className="p-2 sm:p-3">
        <div className="flex items-center text-warning-500">
          <div className="pr-2 sm:pr-3">
            <ExclamationTriangleIcon />
          </div>
          <div>{children}</div>
        </div>
      </CardBody>
    </Card>
  );
}
