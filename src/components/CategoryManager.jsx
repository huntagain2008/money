import { useState } from 'react'
import { Plus, Trash2, Palette } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateId } from '../utils/helpers'
import styles from './CategoryManager.module.css'

const PRESET_COLORS = [
  '#f97316', '#3b82f6', '#a855f7', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#22c55e', '#84cc16', '#f59e0b',
  '#06b6d4', '#6366f1', '#dc2626', '#7c3aed', '#db2777',
]

export default function CategoryManager() {
  const { state, dispatch } = useApp()
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6', type: 'expense' })
  const [showAddForm, setShowAddForm] = useState(false)

  const expenseCategories = state.categories.filter(c => c.type === 'expense')
  const incomeCategories = state.categories.filter(c => c.type === 'income')

  const getUsedCategories = () => {
    return new Set(state.records.map(r => r.category))
  }

  const canDelete = (categoryId) => {
    const category = state.categories.find(c => c.id === categoryId)
    if (!category || category.isPreset) return false
    return !getUsedCategories().has(category.name)
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!newCategory.name.trim()) return

    const category = {
      id: generateId(),
      name: newCategory.name.trim(),
      color: newCategory.color,
      type: newCategory.type,
      isPreset: false,
    }

    dispatch({ type: 'ADD_CATEGORY', payload: category })
    setNewCategory({ name: '', color: '#3b82f6', type: 'expense' })
    setShowAddForm(false)
  }

  const handleDeleteCategory = (categoryId) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: categoryId })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>分类管理</h2>
        <button
          className={styles.addBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={20} />
          <span>{showAddForm ? '取消添加' : '添加分类'}</span>
        </button>
      </div>

      {showAddForm && (
        <form className={styles.addForm} onSubmit={handleAddCategory}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label>分类名称</label>
              <input
                type="text"
                placeholder="输入分类名称"
                value={newCategory.name}
                onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                maxLength={20}
              />
            </div>
            <div className={styles.field}>
              <label>类型</label>
              <select
                value={newCategory.type}
                onChange={e => setNewCategory(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="expense">支出</option>
                <option value="income">收入</option>
              </select>
            </div>
          </div>

          <div className={styles.colorField}>
            <label>颜色</label>
            <div className={styles.colorPicker}>
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorOption} ${newCategory.color === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className={styles.preview}>
            <span>预览:</span>
            <span
              className={styles.previewBadge}
              style={{ backgroundColor: newCategory.color }}
            >
              {newCategory.name || '分类名称'}
            </span>
          </div>

          <button type="submit" className={styles.submitBtn}>
            保存分类
          </button>
        </form>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>支出分类</h3>
        <div className={styles.categoryList}>
          {expenseCategories.map(cat => (
            <div key={cat.id} className={styles.categoryItem}>
              <span
                className={styles.badge}
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </span>
              {cat.isPreset && <span className={styles.preset}>预设</span>}
              {!cat.isPreset && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteCategory(cat.id)}
                  disabled={!canDelete(cat.id)}
                  title={canDelete(cat.id) ? '删除' : '该分类正在使用中'}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>收入分类</h3>
        <div className={styles.categoryList}>
          {incomeCategories.map(cat => (
            <div key={cat.id} className={styles.categoryItem}>
              <span
                className={styles.badge}
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </span>
              {cat.isPreset && <span className={styles.preset}>预设</span>}
              {!cat.isPreset && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteCategory(cat.id)}
                  disabled={!canDelete(cat.id)}
                  title={canDelete(cat.id) ? '删除' : '该分类正在使用中'}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
