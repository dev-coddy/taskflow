import React, { useState } from 'react';
import { generateEODEmail } from '../../services/reportService';
import { EmailPreviewModal } from '../../components/generator/EmailPreviewModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FiMail, FiCalendar, FiBriefcase, FiZap } from 'react-icons/fi';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export const EmailGeneratorPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await generateEODEmail({
        date: selectedDate,
        department: department === 'All' ? undefined : department
      });
      setPreviewResult(res.data);
      toast.success('Report compiled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FiMail className="w-6 h-6 text-blue-600" /> Daily Email Report Generator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Generate consolidated daily status reports for email or chat summary.
        </p>
      </div>

      <Card>
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Target Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Department
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering & QA">Engineering & QA</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Services">Backend Services</option>
                  <option value="QA & Testing">QA & Testing</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
            TaskFlow gathers team status logs for <strong>{dayjs(selectedDate).format('dddd, MMMM D, YYYY')}</strong> and formats a summary ready to copy or email.
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              icon={FiZap}
              loading={loading}
            >
              Generate Report
            </Button>
          </div>
        </form>
      </Card>

      {/* Generated Preview Modal */}
      <EmailPreviewModal
        isOpen={Boolean(previewResult)}
        onClose={() => setPreviewResult(null)}
        emailText={previewResult?.emailText || ''}
        dateStr={previewResult?.date || ''}
        stats={{
          totalUpdatesLogged: previewResult?.totalUpdatesLogged,
          employeeCount: previewResult?.employeeCount
        }}
      />
    </div>
  );
};
