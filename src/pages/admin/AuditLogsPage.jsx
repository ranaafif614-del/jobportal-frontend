import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Filter, Clock } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function AuditLogsPage() {
  const { error } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/audit-logs?page=${page}&limit=20`);
      if (res.data.success) {
        setLogs(res.data.data.logs);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Audit Activity Logs</h1>
        <p className="text-xs text-slate-500 mt-1">Full immutable audit trail of administrative, employer, and candidate activities</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading audit trail...
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No audit logs recorded yet"
          description="System events and user activities will appear here automatically."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/70 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Resource</th>
                  <th className="py-3.5 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                      {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold font-sans">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold text-slate-900">{log.actorEmail || 'System'}</span>
                      <span className="block text-[10px] text-slate-400 uppercase font-sans font-bold">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-sans">
                      {log.targetResource}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 truncate max-w-xs">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={(p) => fetchLogs(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}