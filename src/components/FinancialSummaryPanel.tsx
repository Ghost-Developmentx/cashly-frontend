'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

type Summary = {
  balance: number;
  income: number;
  expenses: number;
  forecast: { name: string; time_horizon: number } | null;
  budget_count: number;
};

export default function FinancialSummaryPanel() {
    const { getToken, isLoaded } = useAuth();
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!isLoaded) return;

      try {
        const token = await getToken();
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary().then(r => r);
  }, [isLoaded, getToken]);

  if (loading) return <div>Loading financial summary...</div>;
  if (!data) return <div>Failed to load summary.</div>;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white shadow p-6 rounded-lg">
      <div>
        <h2 className="text-sm text-gray-500">Total Balance</h2>
        <p className="text-xl font-bold">
  ${data.balance.toFixed(2)}
</p>

      </div>
      <div>
        <h2 className="text-sm text-gray-500">MTD Income</h2>
        <p className="text-xl text-green-600 font-semibold">${data.income.toFixed(2)}</p>
      </div>
      <div>
        <h2 className="text-sm text-gray-500">MTD Expenses</h2>
        <p className="text-xl text-red-500 font-semibold">${data.expenses.toFixed(2)}</p>
      </div>
      <div>
        <h2 className="text-sm text-gray-500">Forecast</h2>
        <p className="text-md">
          {data.forecast ? `${data.forecast.name} (${data.forecast.time_horizon}d)` : 'No forecast yet'}
        </p>
      </div>
    </div>
  );
}
