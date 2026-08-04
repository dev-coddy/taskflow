import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FiCopy, FiDownload, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const EmailPreviewModal = ({
  isOpen,
  onClose,
  emailText = '',
  dateStr = '',
  stats = {}
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    toast.success('EOD Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([emailText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `TaskFlow_EOD_Report_${dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('EOD Report downloaded as .txt!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Consolidated EOD Report - ${dateStr}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Statistics Pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Updates Included: <strong className="text-blue-600 dark:text-blue-400">{stats.totalUpdatesLogged || 0}</strong></span>
          <span>Employees Included: <strong className="text-emerald-600 dark:text-emerald-400">{stats.employeeCount || 0}</strong></span>
        </div>

        {/* Formatted Text Preview Container */}
        <div className="relative">
          <textarea
            readOnly
            rows="14"
            value={emailText}
            className="w-full p-4 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={copied ? FiCheck : FiCopy}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button
              variant="primary"
              icon={FiDownload}
              onClick={handleDownload}
            >
              Download .txt
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
