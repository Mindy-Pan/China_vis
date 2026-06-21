# 🎭 京剧行当分析仪表盘

基于 **1473 部京剧剧本**、**26877 个角色** 的多维度数据可视化分析平台，从行当推断、关系网络、主题建模、叙事结构四个层面对京剧行当体系进行深度挖掘。

## 功能总览

项目包含 **四个分析任务**，对应 27 个可视化组件：

### 任务一：行当推断与分析
基于角色名称与台词特征，推断未标注行当的归属，分析四大行当（生/旦/净/丑）的分布规律与历史变迁。

| 视图 | 说明 |
|------|------|
| 概览总览 | 行当统计卡片、桑基图、特征聚类散点图、PMI 关联表 |
| 行当-角色关联 | 角色类型×行当热力图、PMI矩阵、气泡图 |
| 时期变迁 | 行当占比时间序列、各卷堆叠图 |

### 任务二：角色关系网络分析
构建三层关系网络（共现/对话/权力），比较不同剧种（历史戏/家庭戏/公案戏/神话戏）的网络结构差异。

| 视图 | 说明 |
|------|------|
| 网络总览 | 三层网络结构介绍、剧种密度对比、角色影响力雷达图 |
| 关系网络图 | D3 力导向布局、社区检测（Louvain） |
| 剧种结构对比 | 共现/对话/权力三层网络×四类剧种对比 |
| 角色中心性排名 | PageRank/度中心性/中介中心性跨剧本聚合 |

### 任务三：主题建模与分析
基于 15 类主题关键词词典 + TF-IDF + PCA 降维，提取剧本主题分布并分析主题组合模式。

| 视图 | 说明 |
|------|------|
| 主题总览 | 剧种×主题强度对比、主题组合关联规则、LLM 标注验证 |
| 主题空间分布 | PCA 降维 2D 投影、剧种×主题热力图 |
| 主题关联网络 | 主题共现网络图（PMI 边权重） |
| 主题演化曲线 | 各主题随场景的强度变化趋势 |

### 任务四：叙事结构分析
提取场景级情绪/冲突/事件密度特征，检测叙事高潮，进行四阶段分割（开端/发展/高潮/结局）。

| 视图 | 说明 |
|------|------|
| 叙事总览 | 叙事模板曲线、结构类型分布、高潮位置分析 |
| 叙事曲线 | 四线叠加曲线（张力/冲突/事件/情绪）、四阶段 Treemap |
| 结构对比 | 剧种间叙事结构对比、高潮位置分布 |
| 叙事聚类 | 基于 6 维叙事特征向量的 PCA 聚类 |

## 项目结构

```
├── data/                          # 原始剧本数据（~38 个子目录）
│   ├── 01000000/                  # 卷1： 京剧传统剧目
│   ├── 02000000/                  # 卷2
│   ├── 03000000/                  # 卷3
│   └── ...
│
├── backend/                       # Python 后端分析脚本
│   ├── process_data.py             # 基础数据处理（特征提取/PMI/Purity/Entropy）
│   ├── llm_classify.py             # LLM 辅助行当推断（Ollama + Qwen2.5）
│   ├── llm_classify_batch.py       # 批量 LLM 分类（已弃用）
│   ├── network_analysis.py         # 角色关系网络分析（NetworkX）
│   ├── theme_analysis.py           # 主题建模分析（TF-IDF + PCA + LLM）
│   └── narrative_analysis.py       # 叙事结构分析（SciPy + NumPy）
│
├── frontend/                      # React 前端应用
│   ├── src/
│   │   ├── App.jsx                 # 主应用（4 大任务切换）
│   │   ├── components/             # 27 个可视化组件
│   │   │   ├── SankeyChart.jsx      # 桑基图（ECharts）
│   │   │   ├── ForceGraph.jsx       # 力导向图（D3）
│   │   │   ├── PMITable.jsx         # PMI 关联表
│   │   │   ├── TopicNetwork.jsx     # 主题共现网络
│   │   │   ├── NarrativeCurve.jsx   # 叙事曲线
│   │   │   └── ...
│   │   ├── hooks/                  # 5 个数据加载 hook
│   │   ├── index.css               # 暗色主题样式
│   │   └── main.jsx
│   ├── public/
│   │   └── data/                   # ← 后端处理后的输出数据（~30 个 JSON 文件）
│   ├── dist/                       # 构建产物
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .claude/
│   └── launch.json                 # 预览服务器配置
└── README.md
```

## 技术栈

| 层次 | 技术 |
|------|------|
| **前端框架** | React 18 |
| **可视化** | ECharts 5（Sankey/热力图/时间序列）+ D3.js 7（力导向图/气泡图） |
| **构建工具** | Vite 5 |
| **后端分析** | Python 3 + NetworkX + NumPy + SciPy + scikit-learn |
| **LLM 辅助** | Ollama + Qwen2.5 (7B) |
| **运行环境** | uv（Python 包管理与虚拟环境） |

## 数据流水线

```
data/*.json (原始剧本)
       ↓  读取
backend/*.py (Python 分析处理)
       ↓  写入
frontend/public/data/*.json (处理后的数据)
       ↓  fetch
React 仪表盘 (27 个可视化组件)
```

### 数据文件清单

前端从 `public/data/` 加载约 30 个 JSON 文件：

- **基础数据**：`summary.json`、`character_data.json`、`overall.json`
- **行当分析**：`matrix_data.json`、`sankey_data.json`、`era_data.json`
- **网络分析**：`networks_all.json`、`network_comparison.json`、`character_centrality.json`
- **主题分析**：`theme_script_distributions.json`、`theme_cooccurrence.json`、`theme_topic_space.json`
- **叙事分析**：`narrative_data.json`、`narrative_templates.json`、`narrative_summary.json`
- **LLM 预测**：`llm_predictions.json`、`unlabeled_chars.json`

## 快速开始

### 环境要求

- **Node.js** >= 18
- **Python** >= 3.10
- **uv**（Python 包管理器）
- 可选：[Ollama](https://ollama.ai/) + `qwen2.5:7b`（LLM 行当分类）

### 前端运行

```bash
# 安装依赖（已完成）
cd frontend
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

默认地址：`http://localhost:5173`

### 后端数据处理

```bash
# 创建虚拟环境（已完成）
uv venv backend/.venv

# 安装依赖（已完成）
uv pip install --python backend/.venv/Scripts/python.exe networkx numpy scipy scikit-learn

# 1. 基础数据处理（特征提取、PMI、统计）
uv run --python backend/.venv/Scripts/python.exe python backend/process_data.py

# 2. 角色关系网络分析
uv run --python backend/.venv/Scripts/python.exe python backend/network_analysis.py

# 3. 主题建模分析
uv run --python backend/.venv/Scripts/python.exe python backend/theme_analysis.py

# 4. 叙事结构分析
uv run --python backend/.venv/Scripts/python.exe python backend/narrative_analysis.py

# 5. LLM 辅助行当推断（可选，需本地 Ollama 服务）
uv run --python backend/.venv/Scripts/python.exe python backend/llm_classify.py
```

> **注意**：`llm_classify.py` 需要先启动 Ollama 服务并拉取 `qwen2.5:7b` 模型。如不运行此脚本，前端仍可使用启发式分类结果。

### 更新前端数据

修改剧本数据后，按顺序重新运行上述后端脚本，然后重新构建前端：

```bash
cd frontend
npm run build
```

## 数据格式

### 原始剧本结构（`data/`）

每部剧本为一个 JSON 文件，包含：

```json
{
  "script_id": "01001001",
  "title": "空城计",
  "alias": ["抚琴退兵"],
  "source": "《戏考》",
  "characters": [
    { "name": "诸葛亮", "hangdang": "老生" },
    { "name": "司马懿", "hangdang": "净" }
  ],
  "plot": "三国时...",
  "scenes": [
    {
      "scene_id": 1,
      "name": "第一场",
      "utterances": [
        { "character": "诸葛亮", "type": "念", "text": "兵扎祁山地，要擒司马懿。" },
        { "character": null, "type": "stage", "text": "旗牌上。" }
      ]
    }
  ]
}
```

### 行当分类体系

| 主行当 | 细分类别 |
|--------|----------|
| **生** | 老生、小生、武生、红生、娃娃生 |
| **旦** | 青衣、花旦、武旦、老旦、刀马旦、彩旦、闺门旦 |
| **净** | 铜锤花脸、架子花脸、武净 |
| **丑** | 文丑、武丑、丑旦 |

### 角色类型分类

将军、谋士、帝王、后妃、官员、士兵、平民、仆役、神仙、侠客、书生、武将、奸臣、女将、僧道

## 关键数据指标

| 指标 | 数值 |
|------|------|
| 剧本总数 | 1473 |
| 角色实例总数 | 26877 |
| 已标注行当 | 7259 |
| 未标注角色（LLM/启发式推断） | 19375 |
| 行当分布 | 生 3085 / 旦 1495 / 净 1563 / 丑 1116 |
| 关系网络 | 1380 个剧本共现/对话/权力三层网络 |
| 主题类别 | 15 类（战争军事、智谋策略、忠诚报国等） |
| 叙事分析 | 934 个剧本叙事结构（单峰 87%、双峰 10%、多峰 3%） |

## 后端分析流水线详解

### 1. `process_data.py` — 基础数据处理
- 解析所有剧本 JSON，提取角色特征表
- 特征维度：台词量、权力关键词得分、战斗关键词得分、情感关键词得分、交互度（同场角色数）、主角判定
- 计算 PMI（点互信息）评估角色类型与行当的关联强度
- 计算各行当的纯度（是否集中于特定角色类型）与熵（多样化程度）
- 按剧本卷分组，分析行当分布历史变迁

### 2. `network_analysis.py` — 角色关系网络
- **共现网络**：同一场景出现即建边（无向）
- **对话网络**：台词接续关系建边（有向）
- **权力网络**：命令关键词 → 服从响应建边（有向）
- 计算每个剧本的图指标：密度、聚类系数、平均路径长度、模块度、社区数
- 角色级别：PageRank、度中心性、中介中心性
- 按剧种（历史戏/家庭戏/公案戏/神话戏）聚合对比

### 3. `theme_analysis.py` — 主题建模
- 15 类主题 × 精选关键词词典，逐句打分
- 剧本级主题分布向量（15维）
- TF-IDF 提取主题关键词
- PCA 降维至 2D 可视化
- 主题共现 PMI 矩阵与关联规则挖掘
- 场景级主题演化曲线

### 4. `narrative_analysis.py` — 叙事结构
- 场景级特征：情绪强度（正面/负面关键词计数）、冲突强度、事件密度、角色活跃度
- 高斯平滑 + SciPy `find_peaks` 检测叙事高潮
- 四阶段分割（开端/发展/高潮/结局）
- 叙事模式分类（单峰/双峰/多峰）
- 跨剧种模板曲线对比（12 点归一化）

### 5. `llm_classify.py` — LLM 辅助行当推断
- **启发式分类**：基于角色名称模式 + 台词关键词，对全部 19375 个未标注角色快速分类
- **LLM 分类**：对代表性样本（50 个）调用 Ollama Qwen2.5:7b 进行行当判断
- 合并结果并用 LLM 结果更新角色特征表
- 比较启发式与 LLM 的一致性

## 常见问题

**Q: 前端页面显示"448部剧本 · 6131角色"？**
> 侧边栏底部的文字是静态占位符。顶部标题栏和仪表盘中的数字会动态显示真实数据（1473 部剧本 · 26877 角色）。

**Q: 修改了剧本数据后如何生效？**
> 按顺序运行 5 个后端脚本重新生成数据，然后 `npm run build` 重新构建前端。

**Q: LLM 分类运行很慢？**
> `llm_classify.py` 每次调用 Ollama 需等待约 1-2 秒，50 个样本约需 1-2 分钟。如只想测试前端效果，可跳过此步。

**Q: Python 依赖安装失败？**
> 确保使用 `uv` 创建了虚拟环境并激活，或使用 `pip install networkx numpy scipy scikit-learn` 全局安装。
