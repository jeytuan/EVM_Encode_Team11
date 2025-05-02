// components/ui/DryplingCard.tsx
import React from "react";

export interface Drypling {
  id: number;
  name: string;
  imageUrl: string;
}

export const DryplingCard: React.FC<{ drypling: Drypling }> = ({ drypling }) => (
  <div className="border rounded-lg p-4 text-center shadow-sm">
    <img
      src={drypling.imageUrl}
      alt={drypling.name}
      className="mx-auto mb-2 w-24 h-24 object-cover rounded-full"
    />
    <h3 className="font-semibold">{drypling.name}</h3>
    <p className="text-sm text-gray-600">ID: {drypling.id}</p>
  </div>
);
