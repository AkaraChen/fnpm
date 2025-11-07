# fnpm CLI 性能分析指南 / fnpm CLI Performance Profiling Guide

本目录包含用于分析 fnpm CLI 性能的工具和脚本。

This directory contains tools and scripts for profiling fnpm CLI performance.

## 工具 / Tools

### 1. profile.js - CPU 性能分析器 / CPU Profiler

使用 Node.js 内置的 Inspector API 生成 CPU profile。

Uses Node.js built-in Inspector API to generate CPU profiles.

**用法 / Usage:**

```bash
node profile.js <command> [args...]
```

**示例 / Examples:**

```bash
# 分析 help 命令 / Profile help command
node profile.js --help

# 分析 add 命令 / Profile add command (在有 package.json 的目录中)
cd /path/to/project
node /path/to/fnpm/packages/fnpm/profile.js add lodash

# 分析 init 命令 / Profile init command
cd /tmp/new-project
node /path/to/fnpm/packages/fnpm/profile.js init
```

**输出 / Output:**

生成 `.cpuprofile` 文件，可以通过以下方式查看：

Generates `.cpuprofile` files that can be viewed via:

1. **Chrome DevTools:**
   - 打开 `chrome://inspect`
   - 点击 "Open dedicated DevTools for Node"
   - 进入 "Profiler" 标签
   - 点击 "Load" 并选择 .cpuprofile 文件

2. **speedscope.app:**
   - 访问 https://www.speedscope.app/
   - 拖拽 .cpuprofile 文件到页面
   - 查看交互式火焰图

### 2. analyze-profile.js - 性能分析报告生成器 / Profile Analyzer

解析 .cpuprofile 文件并生成可读的性能报告。

Parses .cpuprofile files and generates readable performance reports.

**用法 / Usage:**

```bash
node analyze-profile.js <profile-file.cpuprofile>
```

**示例 / Example:**

```bash
node analyze-profile.js profile-1762476196304.cpuprofile
```

**输出说明 / Output Explanation:**

- **Self Time**: 函数自身执行时间（不包括调用其他函数的时间）
- **Top Hotspots**: 总体性能热点（包括 Node.js 内部和第三方库）
- **fnpm-specific hotspots**: fnpm 相关代码的性能热点

## 常见性能瓶颈 / Common Performance Bottlenecks

根据初步分析，fnpm CLI 的主要时间消耗在：

Based on initial analysis, fnpm CLI's main time consumption is in:

1. **模块加载 (Module Loading)**: ~150ms (15%)
   - `compileSourceTextModule` - ESM 模块编译
   - Node.js 的模块解析和加载机制

2. **文件系统操作 (File System Operations)**: ~160ms (16%)
   - `lstat`, `readdir`, `stat`, `readlink` - 文件系统查询
   - `realpathSync` - 路径解析
   - 主要用于查找 package.json 和确定项目根目录

3. **依赖解析 (Dependency Resolution)**: ~50ms (5%)
   - 包管理器上下文解析
   - workspace 和 monorepo 检测

## 优化建议 / Optimization Suggestions

### 1. 减少文件系统操作 / Reduce File System Operations

```typescript
// 当前 / Current: 多次 fs 调用
await packageDirectory({ cwd })
await resolveRepoContext(cwd)
await resolveWorkspaceContext(repoContext)

// 优化 / Optimized: 缓存结果
// 考虑在 getContext 中一次性解析所有需要的信息
```

### 2. 延迟加载模块 / Lazy Load Modules

```typescript
// 当前 / Current: 所有命令模块在启动时加载
import Add from './add';
import Remove from './remove';
// ... 等等

// 优化 / Optimized: 按需加载
// 只在执行特定命令时才加载对应模块
```

### 3. 缓存上下文信息 / Cache Context Information

```typescript
// 为相同目录缓存 repoContext 和 workspaceContext
// 使用文件监视器在文件变化时清除缓存
```

## 使用 clinic.js 进行深度分析 / Deep Analysis with clinic.js

clinic.js 更适合分析长时间运行的服务器应用，对于短命令行工具效果有限。

clinic.js is better suited for long-running server applications, with limited effectiveness for short CLI tools.

但对于涉及子进程的命令（如 `add`, `install`），可以使用：

But for commands involving subprocesses (like `add`, `install`), you can use:

```bash
# 安装 clinic.js / Install clinic.js
npm install -g clinic

# 注意：需要使用 node 命令而非直接调用 fnpm
# Note: Must use node command instead of calling fnpm directly
clinic doctor -- node dist/fnpm.js <command>
```

## 基准测试 / Benchmarking

创建简单的基准测试脚本来比较优化前后的性能：

Create simple benchmark scripts to compare performance before and after optimization:

```bash
#!/bin/bash
# benchmark.sh

echo "Benchmarking fnpm commands..."

time fnpm --help
time fnpm add --help
time cd /tmp/test && fnpm init

# 运行多次取平均值
for i in {1..10}; do
  time fnpm --help 2>&1 | grep real
done
```

## 分析结果总结 / Analysis Results Summary

### 当前性能基线 / Current Performance Baseline

- `fnpm --help`: ~1000ms
  - 模块加载: ~150ms (15%)
  - 文件系统: ~160ms (16%)
  - 其他: ~700ms (包括 GC, idle time)

### 改进目标 / Improvement Goals

1. 将 `--help` 命令响应时间减少到 <500ms
2. 减少文件系统调用次数
3. 实现智能缓存机制

## 其他工具 / Other Tools

### Node.js --prof 标志 / Node.js --prof flag

```bash
# 生成 V8 profiler 输出
node --prof dist/fnpm.js --help

# 处理 profiler 输出
node --prof-process isolate-*.log > processed.txt
```

### time 命令 / time command

```bash
# 简单的执行时间测量
time fnpm --help
```

### hyperfine - 命令行基准测试工具 / Command-line benchmarking tool

```bash
# 安装 / Install
cargo install hyperfine

# 使用 / Usage
hyperfine 'fnpm --help' 'npm --help' 'yarn --help'
```

## 贡献 / Contributing

如果你发现了性能瓶颈或有优化建议，请：

If you find performance bottlenecks or have optimization suggestions:

1. 运行 profiler 并生成报告
2. 在 issue 中分享分析结果
3. 提交包含性能改进的 PR

---

**最后更新 / Last Updated**: 2025-11-07
