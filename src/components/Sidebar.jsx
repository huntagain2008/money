import { useApp } from '../context/AppContext'
import { FileText, Tags, BarChart3, Search } from 'lucide-react'
import styles from './Sidebar.module.css'

const tabs = [
  { id: 'records', label: '记账记录', icon: FileText },
  { id: 'categories', label: '分类管理', icon: Tags },
  { id: 'statistics', label: '统计报表', icon: BarChart3 },
  { id: 'search', label: '搜索筛选', icon: Search },
]

export default function Sidebar() {
  const { state, dispatch } = useApp()

  const handleTabClick = (tabId) => {
    dispatch({ type: 'SET_TAB', payload: tabId })
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`${styles.tab} ${state.activeTab === tab.id ? styles.active : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <nav className={styles.mobileNav}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`${styles.mobileTab} ${state.activeTab === tab.id ? styles.active : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
