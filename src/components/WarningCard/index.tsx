import { Card, CardBody } from "@nextui-org/react";
import { ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";

export default function WarningCard({
  children,
  className,
  color = "warning",
}: {
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "warning" | "danger";
}) {

  return (
    <Card className={`bg-${color}-50 ${className || ""}`}>
      <CardBody className="p-2 sm:p-3">
        <div
          className={`flex items-center text-${color}-600`}
        >
          <div className="pr-2 sm:pr-3">
            {color === "primary" ? <InfoCircledIcon /> : <ExclamationTriangleIcon />}
          </div>
          <div>{children}</div>
        </div>
      </CardBody>
    </Card>
  );
}
