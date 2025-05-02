// packages/nextjs/components/ui/avatar.tsx
import React from "react";

export const Avatar = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={
      "rounded-full bg-gray-200 flex items-center justify-center " + className
    }
  >
    {children}
  </div>
);

export const AvatarFallback = ({
  children,
}: {
  children: React.ReactNode;
}) => <span className="text-sm text-gray-700">{children}</span>;
