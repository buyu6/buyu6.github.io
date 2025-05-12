---
title: Kotlin内置函数
date: 2025-05-11 23:42:00
categories:
- Kotlin
tags:
---

### 内置函数

- **use**

  可以保证Lambda表达式中的所有代码执行完毕后自动将外层的流关闭，这样就不用再编写finally语句手动关闭了

- **forEachLine**

  它会将读取的每行内容回调到Lambda表达式，在lambda中完成拼接逻辑

- **arrayOf**

  用于便捷创建数组

- **by lazy**

  懒加载技术，可以先不执行，第一次调用时再执行其中的逻辑

