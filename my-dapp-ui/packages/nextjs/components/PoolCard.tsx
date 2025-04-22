import React from "react";

interface PoolCardProps {
  address: string;
  name: string;
  description: string;
  category: string;
  goal: string;
  deadline: string;
  balance: string;
  withdrawn: boolean;
}

const PoolCard: React.FC<PoolCardProps> = ({
  address,
  name,
  description,
  category,
  goal,
  deadline,
  balance,
  withdrawn,
}) => {
  const goalEth = parseFloat(goal) / 1e18;
  const balanceEth = parseFloat(balance) / 1e18;
  const deadlineDate = new Date(parseInt(deadline) * 1000).toLocaleString();

  return (
    <div className="card bg-base-100 shadow-md p-4 border border-gray-200 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{name}</h3>
        <span className="badge badge-outline">{category}</span>
      </div>

      <p className="text-sm text-gray-600 mt-1">{description}</p>

      <div className="mt-4 text-sm space-y-1">
        <div><strong>Pool Address:</strong> <span className="break-all text-xs">{address}</span></div>
        <div><strong>Goal:</strong> {goalEth} ETH</div>
        <div><strong>Balance:</strong> {balanceEth} ETH</div>
        <div><strong>Deadline:</strong> {deadlineDate}</div>
        <div><strong>Status:</strong> {withdrawn ? "Withdrawn" : "Active"}</div>
      </div>
    </div>
  );
};

export default PoolCard;
