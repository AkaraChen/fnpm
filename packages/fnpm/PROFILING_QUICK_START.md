# fnpm CLI 性能分析工具使用快速指南

## 快速开始

### 1. 生成 CPU Profile

```bash
cd packages/fnpm
pnpm build  # 确保代码已构建
node profile.js --help
```

这会生成一个 `.cpuprofile` 文件，显示总执行时间。

### 2. 分析 Profile

```bash
node analyze-profile.js profile-1762476196304.cpuprofile
```

输出包括：
- Top 20 性能热点
- fnpm 特定代码的热点
- 优化建议

### 3. 运行基准测试

```bash
node benchmark.js
```

对多个命令运行 10 次迭代，生成性能统计。

### 4. 查看详细报告

- 性能分析结果：`PERFORMANCE_REPORT.md`
- 详细指南：`PROFILING.md`

## 当前性能基线

| 命令 | 平均时间 |
|------|----------|
| `fnpm --help` | ~1093ms |
| `fnpm --version` | ~1118ms |
| `fnpm add --help` | ~1141ms |

## 主要瓶颈

1. **ESM 模块加载** (~15%) - 所有命令模块在启动时加载
2. **文件系统操作** (~16%) - 上下文解析需要多次 fs 调用
3. **缺少快速路径** - 简单命令如 `--help` 也执行完整初始化

## 可视化分析

上传 `.cpuprofile` 文件到：
- https://www.speedscope.app/ （推荐）
- Chrome DevTools (chrome://inspect)

## npm Scripts

```bash
pnpm profile <command>         # 生成 CPU profile
pnpm profile:help              # Profile help 命令
pnpm profile:analyze <file>    # 分析 profile 文件
pnpm benchmark                 # 运行基准测试
```

## 优化建议优先级

1. **高**: 实现命令延迟加载 (预期 -30~50ms)
2. **高**: 优化上下文解析 (预期 -50~80ms)
3. **高**: 添加快速路径 (预期 -200~300ms)
4. **中**: 构建优化 (预期 -20~40ms)
5. **低**: 使用编译缓存

**目标**: 将基本命令从 ~1100ms 减少到 <500ms
