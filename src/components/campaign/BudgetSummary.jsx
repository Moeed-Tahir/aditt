export const BudgetSummary = ({ campaignData }) => {
  const budget = parseFloat(campaignData?.campaignBudget) || 0;
  const spent = 0; // You might want to calculate this from your data
  const remaining = budget - spent;

  return (
    <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
      <div className="flex-1 p-6">
        <h2 className="text-[16px] text-gray-400 mb-2">ALLOCATED BUDGET</h2>
        <p className="text-[30px] font-md text-gray-800">
          ${budget.toFixed(2)}
        </p>
      </div>

      <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

      <div className="flex-1 bg-white rounded-xl p-6">
        <h2 className="text-gray-400 text-[16px] mb-2">TOTAL SPENT</h2>
        <p className="text-[30px] font-md text-gray-800">${spent.toFixed(2)}</p>
      </div>

      <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

      <div className="flex-1 bg-white rounded-xl p-6">
        <h2 className="text-[16px] text-gray-400 mb-2">REMAINING BUDGET</h2>
        <p className="text-[30px] font-md text-gray-800">
          ${remaining.toFixed(2)}
        </p>
      </div>
    </div>
  );
};