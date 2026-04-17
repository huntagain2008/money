# 家庭账本 - Family Ledger

## 1. Project Overview

**Project Name**: 家庭账本 (Family Ledger)
**Type**: Single-page web application
**Core Functionality**: Help users track and manage daily income/expenses with categorization, statistics, and data export
**Target Users**: Families and individuals who want to manage personal finances

## 2. Visual Specification

### Layout Structure
- **Header**: App title, theme toggle, data management buttons
- **Sidebar**: Navigation tabs (记账/记录, 分类管理, 统计报表, 搜索筛选)
- **Main Content**: Dynamic content based on selected tab
- **Mobile**: Bottom navigation bar with icons

### Color Palette
**Light Theme**:
- Primary: `#2563eb` (Blue)
- Secondary: `#64748b` (Slate)
- Accent: `#10b981` (Emerald for income), `#ef4444` (Red for expense)
- Background: `#f8fafc`
- Card Background: `#ffffff`
- Text: `#1e293b`

**Dark Theme**:
- Primary: `#3b82f6`
- Secondary: `#94a3b8`
- Accent: `#34d399` (Income), `#f87171` (Expense)
- Background: `#0f172a`
- Card Background: `#1e293b`
- Text: `#f1f5f9`

### Typography
- Font Family: `"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`
- Headings: 600 weight
- Body: 400 weight

### Category Colors
| Category | Color |
|----------|-------|
| 食物 | `#f97316` (Orange) |
| 交通 | `#3b82f6` (Blue) |
| 娱乐 | `#a855f7` (Purple) |
| 医疗 | `#ef4444` (Red) |
| 教育 | `#8b5cf6` (Violet) |
| 工作收入 | `#22c55e` (Green) |
| 购物 | `#ec4899` (Pink) |
| 居住 | `#14b8a6` (Teal) |
| 其他 | `#6b7280` (Gray) |

## 3. Functional Specification

### 3.1 收支记录 (Income/Expense Records)
**Fields**:
- `id`: Unique identifier (UUID)
- `type`: "income" | "expense"
- `amount`: Number (positive)
- `date`: Date string (YYYY-MM-DD)
- `category`: Category name
- `note`: String (optional, max 200 chars)
- `createdAt`: Timestamp

**Features**:
- Add new record via form modal
- Edit existing record
- Delete record with confirmation
- List records with pagination (20 per page)
- Sort by date (newest first)

### 3.2 分类管理 (Category Management)
**Preset Categories**:
- Expense: 食物, 交通, 娱乐, 医疗, 教育, 购物, 居住, 其他
- Income: 工作收入, 投资收入, 奖金, 其他收入

**Features**:
- View all categories
- Add custom category (name + color picker)
- Delete custom category (cannot delete preset)
- Cannot delete category if records exist

### 3.3 统计报表 (Statistics & Reports)
**Displays**:
- Summary cards: 本月/本年总收入, 总支出, 结余
- Period selector: 本月/本年/自定义

**Charts**:
- Pie chart: Expense breakdown by category
- Bar chart: Monthly income vs expense trend (last 6 months)

**Implementation**: Use Chart.js via react-chartjs-2

### 3.4 搜索筛选 (Search & Filter)
**Filter Options**:
- Date range: Start date - End date
- Type: 全部/收入/支出
- Category: Dropdown (all categories)
- Keyword: Search in notes

**Results**: Filtered record list with match highlighting

### 3.5 数据管理 (Data Management)
**LocalStorage**:
- Key: `family_ledger_records`
- Key: `family_ledger_categories`

**Export**:
- CSV format with headers: 日期, 类型, 分类, 金额, 备注
- Excel (.xlsx) using SheetJS library

**Import**:
- CSV file upload
- Validation and preview before import
- Append or replace option

## 4. Technical Specification

### Stack
- **Framework**: React 18 with hooks
- **Bundler**: Vite
- **Charts**: Chart.js + react-chartjs-2
- **Excel Export**: xlsx (SheetJS)
- **Icons**: Lucide React
- **Styling**: CSS Modules or styled-components

### Component Structure
```
App
├── Header (theme toggle, data buttons)
├── Sidebar (navigation)
├── MainContent
│   ├── RecordList (tab: 记录)
│   ├── CategoryManager (tab: 分类)
│   ├── Statistics (tab: 统计)
│   └── SearchFilter (tab: 搜索)
├── RecordModal (add/edit form)
└── ConfirmDialog (delete confirmation)
```

### State Management
- React Context for global state (records, categories, theme)
- useReducer for complex state updates

## 5. Acceptance Criteria

### Core Functionality
- [ ] Can add income/expense record with all fields
- [ ] Can edit existing record
- [ ] Can delete record with confirmation
- [ ] Records persist after page refresh (LocalStorage)
- [ ] Categories can be added and deleted
- [ ] Statistics show correct totals
- [ ] Charts render correctly with data

### Data Management
- [ ] Export to CSV works
- [ ] Export to Excel works
- [ ] Import from CSV works
- [ ] Import validates data

### UI/UX
- [ ] Responsive on mobile and desktop
- [ ] Dark/light theme toggle works
- [ ] All interactive elements have hover states
- [ ] Loading states for async operations

### Search/Filter
- [ ] Date range filter works
- [ ] Category filter works
- [ ] Keyword search works
- [ ] Combined filters work
