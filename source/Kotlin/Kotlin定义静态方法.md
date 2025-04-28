---
title: Kotlin定义静态方法
date: 2025-04-20 22:51:42
categories:
- Kotlin
tags:
---

# 类静态方法

kotlin特有，有与静态方法同样的语法特点但并非静态方法

静态方法特点是可以直接使用(**类.方法**)的形式调用

### 单例类

```kotlin
object Util{
    fun doAction(){
        println("do action")
    }
}
```

单例类中所以方法皆可以视为静态方法

如果只想某一方法变为静态方法可以使用**companion object{}**

```kotlin
class Util{
    fun doAction1(){
        println("do action1")
    }
    companion object{
     fun doAction2(){
        println("do action2")
    }
    }
}
```

------

# 静态方法

### 注解法（不常用）

使用@JvmStatic注解(只能加在单例类或companion object{}中的方法上)

```kotlin
class Util{
    fun doAction1(){
        println("do action1")
    }
    companion object{
        @JvmStatic
     fun doAction2(){
        println("do action2")
    }
    }
}
```

### 顶层方法

1.定义：Kotlin编译器会将所有顶层方法编译成静态方法

2.建立一个kotlin文件：

任意包名->New->Kotlin File/Class在弹窗中选择File类型，该文件中的方法全都是顶层方法

------

