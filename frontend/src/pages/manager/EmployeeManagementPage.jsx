import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import { EmployeeModal } from '../../components/employees/EmployeeModal';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { UserAvatar } from '../../components/common/UserAvatar';
import { FiUserPlus, FiEdit2, FiTrash2, FiMail, FiBriefcase, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { globalSearch } = useOutletContext() || {};

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setEmployees(res.data || []);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const displayedEmployees = employees.filter((emp) => {
    if (!globalSearch || !globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.role?.toLowerCase().includes(q)
    );
  });

  const handleModalSubmit = async (formData) => {
    try {
      setSubmitting(true);
      if (editingEmployee) {
        await updateUser(editingEmployee._id, formData);
        toast.success('Team member updated');
      } else {
        await createUser(formData);
        toast.success('Team member added successfully');
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    try {
      await deleteUser(id);
      toast.success('Team member removed');
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to remove team member');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Team Members</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add new team members using their email and set a temporary password.
          </p>
        </div>

        <Button
          variant="primary"
          icon={FiUserPlus}
          onClick={() => {
            setEditingEmployee(null);
            setIsModalOpen(true);
          }}
        >
          Add Team Member
        </Button>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : displayedEmployees.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <p className="text-sm text-slate-500">No team members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedEmployees.map((emp) => (
            <div
              key={emp._id}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={emp.name} role={emp.role} size="lg" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</h4>
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded ${
                        emp.role === 'Manager'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}>
                        {emp.role}
                      </span>
                    </div>
                  </div>

                  {emp.isActive ? (
                    <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1" title="Active">
                      <FiCheckCircle className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="text-rose-500 text-xs font-semibold flex items-center gap-1" title="Inactive">
                      <FiXCircle className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.department || 'Engineering'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setEditingEmployee(emp);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Team Member"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  title="Delete Team Member"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingEmployee}
        loading={submitting}
      />
    </div>
  );
};
