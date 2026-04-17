export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
}

export function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatDateForInput(dateStr) {
  if (!dateStr) {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  return dateStr
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function getMonthRange(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export function getYearRange(date = new Date()) {
  const year = date.getFullYear()
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export function getMonthName(date = new Date()) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
  })
}

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim())
  const records = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const record = {}
    headers.forEach((header, index) => {
      record[header] = values[index] || ''
    })
    records.push(record)
  }

  return records
}

export function validateImportRecord(record) {
  const errors = []

  if (!record['日期'] && !record['date']) {
    errors.push('缺少日期')
  }
  if (!record['类型'] && !record['type']) {
    errors.push('缺少类型')
  }
  if (!record['分类'] && !record['category']) {
    errors.push('缺少分类')
  }
  if (!record['金额'] && !record['amount']) {
    errors.push('缺少金额')
  } else if (isNaN(parseFloat(record['金额'] || record['amount']))) {
    errors.push('金额格式错误')
  }

  return errors
}
