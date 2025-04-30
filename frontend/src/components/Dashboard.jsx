import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGroup, getGroup } from '../features/groupSlice';
import { addExpense,updateExpense ,deleteExpense,getTotalExpense } from '../features/expenseSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.group.groups);
  const summary = useSelector((state) => state.expense.summary);
  console.log("summary",summary)

  const [addGroupModal, setAddGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');

  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [expenseGroupId, setExpenseGroupId] = useState(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const [editExpenseModal, setEditExpenseModal] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState({
    id: '',
    group_id: '',
    description: '',
    amount: '',
    date: '',
  });


  useEffect(() => {
    dispatch(getGroup());
    dispatch(getTotalExpense());
  }, [dispatch]);

  const handleSubmitGroup = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      dispatch(addGroup({ name: groupName, expenses: [] }));
      setGroupName('');
      setAddGroupModal(false);
    }
  };

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    if (description.trim() && amount && expenseDate) {
      dispatch(addExpense({
        group_id: expenseGroupId,
        description,
        amount,
        date: expenseDate,
      }));
      dispatch(getGroup());
      dispatch(getTotalExpense());
      setDescription('');
      setAmount('');
      setExpenseDate('');
      setExpenseGroupId(null);
      setAddExpenseModal(false);
    }
  };

 

  const handleUpdateExpense = (e) => {
    e.preventDefault();
    const { id, group_id, description, amount, date } = editExpenseData;
    dispatch(updateExpense({ id, group_id, description, amount, date }));
    dispatch(getGroup());
    dispatch(getTotalExpense());
    setEditExpenseModal(false);
 
  };
  

  const handleDeleteExpense = (expenseId)=>{
    dispatch(deleteExpense(expenseId));
    dispatch(getGroup());
  }

  // useEffect(() => {
  //   // dispatch(getTotalExpense());  // Ensure this is being called to populate the summary.
  // }, [dispatch]);





 // Keep your imports and logic exactly the same...

return (
  <div className="min-h-screen bg-gray-100">
    <style>
      {`
        .scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}
    </style>
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-base font-medium text-gray-700">Dashboard</h1>
        <button
          onClick={() => setAddGroupModal(true)}
          className="bg-gray-600 text-white px-2 py-1 text-xs rounded-sm hover:bg-gray-700 transition-all duration-200"
        >
          Add Group
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left side - Static Summary Bar */}
        <div className="w-1/4">
          <div className="bg-white border border-gray-200">
            <div className="px-4 py-3 space-y-6">
              <div>
                <p className="text-sm text-gray-500">Total Expense</p>
                <p className="text-xl font-medium text-gray-800">₹{summary.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Expense</p>
                <p className="text-xl font-medium text-gray-800">₹{summary.monthly}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Highest Expense</p>
                <p className="text-xl font-medium text-gray-800">₹{summary.highest}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Groups */}
        <div className="w-3/4 space-y-4">
          {groups?.map((group) => (
            <div key={group.id} className="bg-white border border-gray-200">
              <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50">
                <h2 className="text-base font-medium font-bold text-gray-700">{group.name}</h2>
                <button
                  onClick={() => {
                    setExpenseGroupId(group.id);
                    setAddExpenseModal(true);
                  }}
                  className="bg-gray-600 text-white px-2 py-1 text-xs rounded-sm hover:bg-gray-700 transition-all duration-200"
                >
                  Add Expense
                </button>
              </div>

              <div className="max-h-[120px] overflow-y-auto scrollbar">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Description</th>
                      <th className="text-right px-3 py-2 font-medium w-24">Amount</th>
                      <th className="text-left px-3 py-2 font-medium w-28">Date</th>
                      <th className="text-right px-3 py-2 font-medium w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.expenses?.length ? (
                      group.expenses.map((expense) => (
                        <tr key={expense.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-1.5 text-gray-800">{expense.description}</td>
                          <td className="px-3 py-1.5 text-right text-gray-800">₹{expense.amount}</td>
                          <td className="px-3 py-1.5 text-gray-500 text-sm">{expense.date}</td>
                          <td className="px-3 py-1.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditExpenseData({
                                  id: expense.id,
                                  group_id: group.id,
                                  description: expense.description,
                                  amount: expense.amount,
                                  date: expense.date,
                                });
                                setEditExpenseModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-800 px-1.5 py-0.5 text-xs mr-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700 px-1.5 py-0.5 text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-sm text-gray-500">
                          No expenses yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Modals below (no changes in structure, just classes) */}
    {/* Add Group Modal */}
    {addGroupModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h3 className="text-lg font-semibold mb-4">Add Group</h3>
          <form onSubmit={handleSubmitGroup}>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full border px-3 py-2 mb-4 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddGroupModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Add Expense Modal */}
    {addExpenseModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
          <form onSubmit={handleSubmitExpense}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddExpenseModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Edit Expense Modal */}
    {editExpenseModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h3 className="text-lg font-semibold mb-4">Edit Expense</h3>
          <form onSubmit={handleUpdateExpense}>
            <input
              type="text"
              value={editExpenseData.description}
              onChange={(e) =>
                setEditExpenseData({ ...editExpenseData, description: e.target.value })
              }
              placeholder="Description"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="number"
              value={editExpenseData.amount}
              onChange={(e) =>
                setEditExpenseData({ ...editExpenseData, amount: e.target.value })
              }
              placeholder="Amount (₹)"
              className="w-full border px-3 py-2 mb-3 rounded"
              required
            />
            <input
              type="date"
              value={editExpenseData.date}
              onChange={(e) =>
                setEditExpenseData({ ...editExpenseData, date: e.target.value })
              }
              className="w-full border px-3 py-2 mb-4 rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditExpenseModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

}

export default Dashboard;
