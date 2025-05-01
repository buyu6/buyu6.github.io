---
title: Kotlin扩展函数和运算符重载
date: 2025-05-01 16:13:13
categories:
- Kotlin
tags:
---

# 扩展函数

### 语法结构

```kotlin
fun ClassName.methodName(param1:Int,param2:Int):Int{
return 0
}
```

### 实例

```kotlin
//构建扩展函数
fun String.lettersCount():Int{
    var count=0
    for(char in this){
        if(char.isLetter()){
            count++
        }
    }
    return count
}
```

```kotlin
//调用
fun main(){
    val cnt="ABC123xyz!@#".lettersCount()
    println(cnt)
}
```

------

# 运算符重载

### 语法结构(可以实现同一个运算符多重重载)

```kotlin
//重载
class obj{
    operator fun plus(obj:Obj):Obj{
        //处理相加的逻辑
    }
}
//调用
val obj1=Obj()
val obj2=Obj()
val obj3=obj1+obj2
```

### 实例

1.Money实例

```kotlin
class Money(val value: Int) {
    //对象和对象相加
    operator fun plus(money:Money):Money{
        val sum=value+money.value
        return Money(sum)
    }
    //对象和数字相加
    operator fun plus(newValue: Int):Money{
        val sum=value+newValue
        return Money(sum)
    }
}
fun main(){
    val m1=Money(5)
    val m2=Money(10)
    val m3=m1+m2
    val m4=m3+20
println(m4.value)
}
```

2.**a in b**实例

```kotlin
//判断hello中有没有he
if("he" in "hello"){
    
}
```

3.扩展函数和运算符重载综合使用实例

```kotlin
//重载
operator fun String.times(n:Int):String{
    val builder=StringBuilder()
  repeat(n){
      builder.append(this)
  }
    return builder.toString()
}
//重载简化
operator fun String.times(n:Int)= repeat(n)
//调用
fun main(){
    val str="abc"*3
    println(str)
}
```

------

