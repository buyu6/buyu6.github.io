---
title: Kotlin延迟初始化和密封类
date: 2025-04-25 21:41:59
categories:
- Kotlin
tags:
---

# 变量延迟初始化

### 关键字

**lateinit**

### 作用

如果一个变量是全局变量且初始化在后面的过程中进行时该变量不得不赋值为null，但如果这样进行后面调用其任何方法都需要进行判空处理相对麻烦，所以这里可以使用延迟初始化，就不需要将其赋值为null了

### 注意

使用延迟初始化时一定要保证后续某处对其完成了初始化

还可以通过代码进行判断是否完成了初始化

```kotlin
//::adapter.isInitialized表示已经初始化
if(!::adapter.isInitialized){
    adapter=MsgAdapter(msgList)
}
```

------

# 密封类

### 关键字

**sealed class**

### 作用

解决因语法原因导致的多余分支问题

### 实例

```kotlin
sealed class Result
class Success(val msg:String):Result()
class Failure(val error:Exception):Result()
```

```kotlin
fun getResultMsg(result:Result)=when(result){
    is Success -> result.msg
    is Failure -> "Error is ${result.error.message}"
}
```

### 注意

密封类及其子类只能定义在同一文件的顶层位置，不能嵌套在其他类中

------

