import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const Transactions = () => {
  const transactions = useSelector(state => state.payments.transactions);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Payments & Transactions</h2>
        <p className="text-slate-500 text-sm">View financial records</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{txn.student}</td>
                  <td className="px-6 py-4">{txn.type}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">₹{txn.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{txn.date}</td>
                  <td className="px-6 py-4">
                    <Badge variant={txn.status === 'Success' ? 'primary' : 'warning'}>{txn.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
