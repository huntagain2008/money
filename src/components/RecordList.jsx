import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { formatDate, formatCurrency } from '../utils/helpers'
import styles from './RecordList.module.css'

const ITEMS_PER_PAGE = 20

export default function RecordList({ onAddRecord, onEditRecord, onDeleteRecord }) {
  const { state } = useApp()
  const [currentPage, setCurrentPage] = useState(1)

  const sortedRecords = useMemo(() => {
    return [...state.records].sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date)
      if (dateCompare !== 0) return dateCompare
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [state.records])

  const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const visibleRecords = sortedRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getCategoryColor = (categoryName) => {
    const category = state.categories.find(c => c.name === categoryName)
    return category ? category.color : '#6b7280'
  }

  const getCategoryType = (categoryName) => {
    const category = state.categories.find(c => c.name === categoryName)
    return category ? category.type : 'expense'
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>记账记录</h2>
        <button className={styles.addBtn} onClick={onAddRecord}>
          <Plus size={20} />
          <span>添加记录</span>
        </button>
      </div>

      {state.records.length === 0 ? (
        <div className={styles.empty}>
          <p>暂无记录</p>
          <p className={styles.emptyHint}>点击上方"添加记录"开始记账</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {visibleRecords.map(record => (
              <div key={record.id} className={styles.record}>
                <div
                  className={styles.categoryDot}
                  style={{ backgroundColor: getCategoryColor(record.category) }}
                />
                <div className={styles.recordInfo}>
                  <div className={styles.recordMain}>
                    <span className={styles.category}>{record.category}</span>
                    <span className={styles.amount} data-type={getCategoryType(record.category)}>
                      {getCategoryType(record.category) === 'income' ? '+' : '-'}
                      {formatCurrency(record.amount)}
                    </span>
                  </div>
                  <div className={styles.recordMeta}>
                    <span className={styles.date}>{formatDate(record.date)}</span>
                    {record.note && <span className={styles.note}>{record.note}</span>}
                  </div>
                </div>
                <div className={styles.recordActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => onEditRecord(record)}
                    title="编辑"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => onDeleteRecord(record)}
                    title="删除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={20} />
              </button>
              <span className={styles.pageInfo}>
                第 {currentPage} / {totalPages} 页
              </span>
              <button
                className={styles.pageBtn}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
