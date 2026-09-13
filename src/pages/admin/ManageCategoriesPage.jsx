import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function ManageCategoriesPage() {
  const { success, error } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Briefcase');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data.categories);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Briefcase');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Briefcase');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Category name is required');
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, {
          name,
          description,
          icon
        });
        if (res.data.success) {
          success('Category updated successfully');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await api.post('/categories', {
          name,
          description,
          icon
        });
        if (res.data.success) {
          success('Category created successfully');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      error(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/categories/${cat._id}`);
      if (res.data.success) {
        success('Category deleted successfully');
        setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      }
    } catch (err) {
      error(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Job Categories</h1>
          <p className="text-xs text-slate-500 mt-1">Add, update, or remove job industry categories across the portal</p>
        </div>
        <Button onClick={openCreateModal} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No categories found"
          description="Create your first job category."
          actionText="Create Category"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start justify-between gap-3 hover:border-brand-300 transition-all"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{cat.description || 'No description provided.'}</p>
                <span className="inline-block text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                  {cat.jobCount || 0} active jobs
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEditModal(cat)}
                  title="Edit Category"
                  className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  title="Delete Category"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI & Machine Learning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Icon Key
            </label>
            <input
              type="text"
              placeholder="e.g. Code, Globe, Cpu, Cloud, Shield..."
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Short description of jobs in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}