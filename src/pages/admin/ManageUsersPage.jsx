import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const { success, error } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.set('page', page);
      query.set('limit', '15');
      if (roleFilter !== 'all') query.set('role', roleFilter);
      if (statusFilter !== 'all') query.set('status', statusFilter);
      if (search.trim()) query.set('search', search.trim());

      const res = await api.get(`/admin/users?${query.toString()}`);
      if (res.data.success) {
        setUsers(res.data.data.users);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      error(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleToggleStatus = async (user) => {
    if (user._id === currentUser?._id) {
      error('You cannot suspend your own account');
      return;
    }

    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await api.patch(`/admin/users/${user._id}/status`, { status: nextStatus });
      if (res.data.success) {
        success(`User ${user.email} is now ${nextStatus}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      error(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user._id === currentUser?._id) {
      error('You cannot delete your own admin account');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete account ${user.email}?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${user._id}`);
      if (res.data.success) {
        success('User deleted successfully');
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
      }
    } catch (err) {
      error(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">Inspect user accounts, manage roles, and toggle suspensions</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Roles</option>
            <option value="candidate">Candidates</option>
            <option value="employer">Employers</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="No user accounts match your search or filter options."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/70 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">User / Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {u.name}
                      {u.role === 'employer' && u.employerProfile?.companyName && (
                        <span className="block text-xs font-normal text-slate-500">
                          {u.employerProfile.companyName}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 font-mono">
                      {u.email}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={u.role}>{u.role}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={u.status}>{u.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u._id !== currentUser?._id && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                                u.status === 'active'
                                  ? 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                                  : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                              }`}
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u)}
                              title="Delete Account"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
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
              onPageChange={(p) => fetchUsers(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}