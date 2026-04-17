import { AlertTriangle } from 'lucide-react'
import styles from './ConfirmDialog.module.css'

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <div className={styles.icon}>
          <AlertTriangle size={32} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            取消
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            确认删除
          </button>
        </div>
      </div>
    </div>
  )
}
