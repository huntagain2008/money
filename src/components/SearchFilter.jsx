import { useState, useMemo } from 'react'
import { Search, Calendar, Filter, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, formatCurrency, getMonthRange } from '../utils/helpers'
import styles from './SearchFilter.module.css'

export default function SearchFilter() {
  const { state } = useApp()
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    category: 'all',
    keyword: '',
  })

  const monthRange = getMonthRange()

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: 'all',
      category: 'all',
      keyword: '',
    })
  }

  const filteredRecords = useMemo(() => {
    return state.records.filter(record => {
      if (filters.startDate && record.date < filters.startDate) return false
      if (filters.endDate && record.date > filters.endDate) return false
      if (filters.type !== 'all' && record.type !== filters.type) return false
      if (filters.category !== 'all' && record.category !== filters.category) return false
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        const noteMatch = record.note && record.note.toLowerCase().includes(keyword)
        const categoryMatch = record.category.toLowerCase().includes(keyword)
        if (!noteMatch && !categoryMatch) return false
      }
      return true
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [state.records, filters])

  const hasActiveFilters = filters.startDate || filters.endDate ||
    filters.type !== 'all' || filters.category !== 'all' || filters.keyword

  const getCategoryColor = (categoryName) => {
    const category = state.categories.find(c => c.name === categoryName)
    return category ? category.color : '#6b7280'
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>搜索筛选</h2>
        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}>
            <X size={16} />
            清除筛选
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>
            <Calendar size={16} />
            日期范围
          </label>
          <div className={styles.dateRange}>
            <input
              type="date"
              value={filters.startDate}
              onChange={e => setFilter('startDate', e.target.value)}
              max={filters.endDate || undefined}
            />
            <span>至</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={e => setFilter('endDate', e.target.value)}
              min={filters.startDate || undefined}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>
            <Filter size={16} />
            类型
          </label>
          <select value={filters.type} onChange={e => setFilter('type', e.target.value)}>
            <option value="all">全部</option>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>
            <Filter size={16} />
            分类
          </label>
          <select value={filters.category} onChange={e => setFilter('category', e.target.value)}>
            <option value="all">全部分类</option>
            {state.categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>
            <Search size={16} />
            关键词
          </label>
          <input
            type="text"
            placeholder="搜索备注或分类"
            value={filters.keyword}
            onChange={e => setFilter('keyword', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.resultsHeader}>
          <span>找到 {filteredRecords.length} 条记录</span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className={styles.empty}>
            {hasActiveFilters ? '没有符合条件的记录' : '暂无记录'}
          </div>
        ) : (
          <div className={styles.list}>
            {filteredRecords.map(record => (
              <div key={record.id} className={styles.record}>
                <span
                  className={styles.categoryDot}
                  style={{ backgroundColor: getCategoryColor(record.category) }}
                />
                <div className={styles.recordInfo}>
                  <div className={styles.recordMain}>
                    <span className={styles.category}>{record.category}</span>
                    <span
                      className={styles.amount}
                      data-type={record.type}
                    >
                      {record.type === 'income' ? '+' : '-'}
                      {formatCurrency(record.amount)}
                    </span>
                  </div>
                  <div className={styles.recordMeta}>
                    <span className={styles.date}>{formatDate(record.date)}</span>
                    {record.note && (
                      <span
                        className={styles.note}
                        dangerouslySetInnerHTML={{
                          __html: filters.keyword
                            ? record.note.replace(
                                new RegExp(`(${filters.keyword})`, 'gi'),
                                '<mark>$1</mark>'
                              )
                            : record.note,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
