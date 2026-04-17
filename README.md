# 家庭账本 - Family Ledger

简单易用的家庭收支管理工具，帮助你记录日常开支、统计消费分布。

**在线访问**: https://spend.cc.cd

---

## 功能特性

### 记账功能
- 添加收入/支出记录（金额、日期、分类、备注）
- 编辑和删除已有记录
- 分页展示，每页 20 条

### 分类管理
- 预设分类：食物、交通、娱乐、医疗、教育、购物、居住、其他（支出）；工作收入、投资收入、奖金、其他收入（收入）
- 支持添加自定义分类（自定义名称和颜色）
- 删除自定义分类（预设分类不可删除，使用中的分类不可删除）

### 统计报表
- 本月/本年收支概览（总收入、总支出、结余）
- 支出分类占比饼图
- 近6个月收支趋势柱状图

### 搜索筛选
- 按日期范围筛选
- 按类型筛选（全部/收入/支出）
- 按分类筛选
- 关键词搜索（匹配备注和分类）
- 搜索结果高亮显示

### 数据管理
- 浏览器本地存储（LocalStorage），关闭浏览器数据不丢失
- 导出为 CSV 格式（可用 Excel 打开）
- 导出为 Excel 格式（.xlsx）
- 从 CSV 导入数据（自动验证）

### 界面特性
- 深色/浅色主题切换
- 响应式设计，支持手机和电脑访问
- 移动端底部导航栏

---

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 | 前端框架 |
| Vite | 构建工具 |
| Chart.js + react-chartjs-2 | 图表 |
| xlsx (SheetJS) | Excel 导出 |
| Lucide React | 图标库 |
| CSS Modules | 样式隔离 |

---

## 本地开发

### 环境要求
- Node.js 16+
- npm 或 yarn

### 运行步骤

```bash
# 1. 克隆项目（如果你已经从 GitHub 拉取）
git clone https://github.com/huntagain2008/money.git
cd money

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

访问 http://localhost:5173

### 构建部署

```bash
# 构建生产版本
npm run build
```

构建产物在 `dist/` 目录，上传到 GitHub Pages 对应分支即可。

---

## 数据存储说明

当前版本使用**浏览器 LocalStorage** 存储数据：
- 每条浏览器各自保存数据
- 清除浏览器缓存会丢失数据
- 不同浏览器/设备数据不互通

如需多设备同步或家庭共享，请参考云端同步版本的开发。

---

## 文件结构

```
src/
├── components/          # React 组件
│   ├── Header          # 页头（标题、主题切换、数据导入导出）
│   ├── Sidebar         # 侧边栏导航
│   ├── RecordList      # 记账记录列表
│   ├── RecordModal     # 添加/编辑记录弹窗
│   ├── ConfirmDialog   # 删除确认弹窗
│   ├── CategoryManager # 分类管理
│   ├── Statistics      # 统计报表
│   └── SearchFilter    # 搜索筛选
├── context/
│   └── AppContext.jsx  # 全局状态管理
├── utils/
│   └── helpers.js      # 工具函数
└── App.jsx             # 根组件
```
