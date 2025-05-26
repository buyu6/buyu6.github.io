---
title: Kotlin的infix函数
date: 2025-05-26 21:22:12
categories:
- Kotlin
tags:
---

### 特点

`infix` [关键字](https://so.csdn.net/so/search?q=关键字&spm=1001.2101.3001.7020)可以让 **单参数的函数** 以 **更自然的语法** 书写，使代码更易读。
你可以把它理解为 **一种特殊的调用方式**，不需要 `.` 和 `()`，让代码像 **自然语言** 一样流畅。例如mapOf中的键值对(A to B实际等价于A.to(B))省略了  `.`  和  `（）`。

### 条件

要使用 `infix`，需要满足 **三个条件**：

1. **必须是成员函数或扩展函数**（它必须属于某个类或某种类型）。
2. **必须只有且只能有一个参数**（如果有多个参数，就不能用 `infix`）。
3. ⭐⭐⭐⭐⭐⭐**调用时可以省略 `.` 和 `()`**（但仍然可以用 `.` 调用）。

### 实例

```kotlin
infix fun <T> Collection<T>.has(element:T)=contains(element)
val list =listOf("Apple","Banana","Orange","Pear","Grape")
if(list has "Banana"){
    //处理具体逻辑
}
```

------

