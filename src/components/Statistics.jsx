import { useState, useMemo } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatCurrency, getMonthRange, getYearRange, getMonthName } from '../utils/helpers'
import styles from './Statistics.module.css'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const PERIODS = [
  { id: 'month', label: '本月' },
  { id: 'year', label: '本年' },
]

export default function Statistics() {
  const { state } = useApp()
  const [period, setPeriod] = useState('month')

  const dateRange = useMemo(() => {
    return period === 'month' ? getMonthRange() : getYearRange()
  }, [period])

  const filteredRecords = useMemo(() => {
    return state.records.filter(r => r.date >= dateRange.start && r.date <= dateRange.end)
  }, [state.records, dateRange])

  const summary = useMemo(() => {
    const income = filteredRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0)
    const expense = filteredRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)
    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [filteredRecords])

  const categoryData = useMemo(() => {
    const expenseByCategory = {}
    filteredRecords
      .filter(r => r.type === 'expense')
      .forEach(r => {
        expenseByCategory[r.category] = (expenseByCategory[r.category] || 0) + r.amount
      })

    const categories = Object.keys(expenseByCategory)
    const data = categories.map(cat => expenseByCategory[cat])

    return {
      labels: categories,
      datasets: [{
        data,
        backgroundColor: categories.map(cat => {
          const category = state.categories.find(c => c.name === cat)
          return category ? category.color : '#6b7280'
        }),
        borderWidth: 0,
      }],
    }
  }, [filteredRecords, state.categories])

  const monthlyTrend = useMemo(() => {
    const months = []
    const incomeData = []
    const expenseData = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const range = getMonthRange(date)

      const monthRecords = state.records.filter(r => r.date >= range.start && r.date <= range.end)

      months.push(date.toLocaleDateString('zh-CN', { month: 'short' }))

      incomeData.push(
        monthRecords
          .filter(r => r.type === 'income')
          .reduce((sum, r) => sum + r.amount, 0)
      )

      expenseData.push(
        monthRecords
          .filter(r => r.type === 'expense')
          .reduce((sum, r) => sum + r.amount, 0)
      )
    }

    return {
      labels: months,
      datasets: [
        {
          label: '收入',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 6,
        },
        {
          label: '支出',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderRadius: 6,
        },
      ],
    }
  }, [state.records])

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text'),
          font: { size: 12 },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text'),
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
        },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
          callback: (value) => formatCurrency(value),
        },
      },
    },
  }

  const chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>统计报表</h2>
        <div className={styles.periodToggle}>
          {PERIODS.map(p => (
            <button
              key={p.id}
              className={`${styles.periodBtn} ${period === p.id ? styles.active : ''}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={`${styles.card} ${styles.income}`}>
          <div className={styles.cardIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardLabel}>总收入</span>
            <span className={styles.cardValue}>{formatCurrency(summary.income)}</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.expense}`}>
          <div className={styles.cardIcon}>
            <TrendingDown size={24} />
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardLabel}>总支出</span>
            <span className={styles.cardValue}>{formatCurrency(summary.expense)}</span>
          </div>
        </div>

        <div className={`${styles.card} ${summary.balance >= 0 ? styles.positive : styles.negative}`}>
          <div className={styles.cardIcon}>
            <Wallet size={24} />
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardLabel}>结余</span>
            <span className={styles.cardValue}>{formatCurrency(summary.balance)}</span>
          </div>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h3>支出分类占比</h3>
          <div className={styles.chartContainer}>
            {categoryData.labels.length > 0 ? (
              <Pie data={categoryData} options={pieOptions} />
            ) : (
              <div className={styles.noData}>暂无支出数据</div>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>月度收支趋势</h3>
          <div className={styles.chartContainer}>
            <Bar data={monthlyTrend} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
