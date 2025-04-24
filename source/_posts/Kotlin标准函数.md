---
title: Kotlin标准函数
date: 2025-04-19 21:56:44
categories:
- Kotlin
tags:
---

# with

作用：可以在连续调用同一个对象的多个方法时让代码变得更简便

标准形式：

```kotlin
val result = with (obj){
    //这里是obj的上下文
    "value"//with函数返回值
}
```

实例：

```kotlin
val list= listOf("Apple","Banana","Pear")
    val result=with(StringBuilder()){
        append("Start eating fruits.\n")
        for(fruit in list){
            append(fruit).append("\n")
        }
        append("Ate all Fruits")
        toString()
    }
    println(result)
```

------

# run

作用：同with相同只是通常不会直接调用而是在对象的基础上调用

标准形式：

```kotlin
val result =obj.run{
    //这里是obj的上下文
    "value"//run函数返回值
}
```

实例：

```kotlin
val list= listOf("Apple","Banana","Pear")
    val result=StringBuilder().run{
        append("Start eating fruits.\n")
        for(fruit in list){
            append(fruit).append("\n")
        }
        append("Ate all Fruits")
        toString()
    }
    println(result)
```



------

# apply

作用：作用和run类似只是无法指定返回值

标准形式：

```kotlin
val result =obj.apply{
    //这里是obj的上下文
}
result==obj
```

实例：

```kotlin
    val list= listOf("Apple","Banana","Pear")
    val result=StringBuilder().apply{
        append("Start eating fruits.\n")
        for(fruit in list){
            append(fruit).append("\n")
        }
        append("Ate all Fruits")
    }
    println(result.toString())
```

**利用Intent传递数据时也可以使用apply函数**

```kotlin
val intent=Intent(context,SecondActivity::class.java).apply{
    putExtra("param1","data1")
    putExtra("param2","data2")
}
context.startActivity(intent)
```



------

