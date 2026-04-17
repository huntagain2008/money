import { useApp } from '../context/AppContext'
import { Sun, Moon, Download, Upload, FileSpreadsheet } from 'lucide-react'
import styles from './Header.module.css'

export default function Header() {
  const { state, dispatch } = useApp()

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })
  }

  const handleExportCSV = () => {
    const headers = ['日期', '类型', '分类', '金额', '备注']
    const rows = state.records.map(r => [
      r.date,
      r.type === 'income' ? '收入' : '支出',
      r.category,
      r.amount,
      r.note || '',
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `家庭账本_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportExcel = async () => {
    const { utils, writeFile } = await import('xlsx')

    const data = state.records.map(r => ({
      '日期': r.date,
      '类型': r.type === 'income' ? '收入' : '支出',
      '分类': r.category,
      '金额': r.amount,
      '备注': r.note || '',
    }))

    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, '记账记录')

    const colWidths = [
      { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 20 },
    ]
    ws['!cols'] = colWidths

    writeFile(wb, `家庭账本_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      const text = await file.text()
      const { parseCSV, validateImportRecord, generateId } = await import('../utils/helpers')

      const parsed = parseCSV(text)
      if (parsed.length === 0) {
        alert('CSV文件格式错误或为空')
        return
      }

      const validRecords = []
      const errors = []

      parsed.forEach((row, index) => {
        const validationErrors = validateImportRecord(row)
        if (validationErrors.length > 0) {
          errors.push(`第${index + 2}行: ${validationErrors.join(', ')}`)
        } else {
          validRecords.push({
            id: generateId(),
            date: row['日期'] || row['date'],
            type: (row['类型'] || row['type']) === '收入' || (row['类型'] || row['type']) === 'income' ? 'income' : 'expense',
            category: row['分类'] || row['category'],
            amount: parseFloat(row['金额'] || row['amount']),
            note: row['备注'] || row['note'] || '',
            createdAt: new Date().toISOString(),
          })
        }
      })

      if (errors.length > 0) {
        alert('导入警告:\n' + errors.slice(0, 5).join('\n') + (errors.length > 5 ? '\n...还有更多错误' : ''))
      }

      if (validRecords.length > 0) {
        dispatch({ type: 'IMPORT_RECORDS', payload: [...state.records, ...validRecords] })
        alert(`成功导入 ${validRecords.length} 条记录`)
      }

      input.remove()
    }
    input.click()
  }

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <FileSpreadsheet size={28} />
        <h1>家庭账本</h1>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleExportCSV} title="导出CSV">
          <Download size={20} />
          <span>CSV</span>
        </button>
        <button className={styles.actionBtn} onClick={handleExportExcel} title="导出Excel">
          <FileSpreadsheet size={20} />
          <span>Excel</span>
        </button>
        <button className={styles.actionBtn} onClick={handleImport} title="导入CSV">
          <Upload size={20} />
          <span>导入</span>
        </button>
        <button className={styles.themeToggle} onClick={toggleTheme} title="切换主题">
          {state.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}
