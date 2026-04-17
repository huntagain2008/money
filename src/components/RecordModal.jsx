import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateId, formatDateForInput } from '../utils/helpers'
import styles from './RecordModal.module.css'

export default function RecordModal({ isOpen, onClose, editRecord }) {
  const { state, dispatch } = useApp()
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    date: formatDateForInput(),
    category: '',
    note: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editRecord) {
      setFormData({
        type: editRecord.type,
        amount: editRecord.amount.toString(),
        date: editRecord.date,
        category: editRecord.category,
        note: editRecord.note || '',
      })
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        date: formatDateForInput(),
        category: '',
        note: '',
      })
    }
    setErrors({})
  }, [editRecord, isOpen])

  const filteredCategories = state.categories.filter(c => c.type === formData.type)

  const validate = () => {
    const newErrors = {}
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = '请输入有效金额'
    }
    if (!formData.date) {
      newErrors.date = '请选择日期'
    }
    if (!formData.category) {
      newErrors.category = '请选择分类'
    }
    if (formData.note && formData.note.length > 200) {
      newErrors.note = '备注不能超过200字符'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const record = {
      id: editRecord ? editRecord.id : generateId(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      note: formData.note,
      createdAt: editRecord ? editRecord.createdAt : new Date().toISOString(),
    }

    if (editRecord) {
      dispatch({ type: 'UPDATE_RECORD', payload: record })
    } else {
      dispatch({ type: 'ADD_RECORD', payload: record })
    }

    onClose()
  }

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      if (field === 'type') {
        newData.category = ''
      }
      return newData
    })
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{editRecord ? '编辑记录' : '添加记录'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.typeToggle}>
            <button
              type="button"
              className={`${styles.typeBtn} ${formData.type === 'expense' ? styles.expense : ''}`}
              onClick={() => handleChange('type', 'expense')}
            >
              支出
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${formData.type === 'income' ? styles.income : ''}`}
              onClick={() => handleChange('type', 'income')}
            >
              收入
            </button>
          </div>

          <div className={styles.field}>
            <label>金额</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={e => handleChange('amount', e.target.value)}
              className={errors.amount ? styles.inputError : ''}
            />
            {errors.amount && <span className={styles.error}>{errors.amount}</span>}
          </div>

          <div className={styles.field}>
            <label>日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => handleChange('date', e.target.value)}
              className={errors.date ? styles.inputError : ''}
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </div>

          <div className={styles.field}>
            <label>分类</label>
            <select
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
              className={errors.category ? styles.inputError : ''}
            >
              <option value="">请选择分类</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <span className={styles.error}>{errors.category}</span>}
          </div>

          <div className={styles.field}>
            <label>备注</label>
            <textarea
              placeholder="添加备注（可选）"
              value={formData.note}
              onChange={e => handleChange('note', e.target.value)}
              maxLength={200}
              rows={3}
              className={errors.note ? styles.inputError : ''}
            />
            {errors.note && <span className={styles.error}>{errors.note}</span>}
            <span className={styles.charCount}>{formData.note.length}/200</span>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              取消
            </button>
            <button type="submit" className={styles.submitBtn}>
              {editRecord ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
