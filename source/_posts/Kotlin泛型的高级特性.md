---
title: Kotlin泛型的高级特性
date: 2025-05-29 19:25:42
categories:
- Kotlin
tags:
---

### 泛型的实化

**条件**

- 内联函数
- reified关键字修饰

**举例**

```kotlin
inline fun <reified T> getGenericType(){
    
}
```

**应用**

启动活动

- 新建一个reified.kt文件

```kotlin
inline fun <reified T> startActivity(context:Context,block:Intent.()->Unit){
    val intent= Intent(context,T::class.java)
    //高阶函数用于传递数据
    intent.block()
    context.startActivity(intent)
}
```

- 启动活动

```kotlin
startActivity<Test>(this){
                putExtra("param1","data")
                putExtra("param2",123)
            }
```

### 泛型的协变

**定义**

假如定义一个MyClass<T>的泛型类，其中A是B的子类型，同时MyClass<A>是MyClass<B>的子类型，就称MyClass在T这个泛型上是协变的

**条件**

一个泛型类在其泛型类型的数据上是只读的情况，简而言之，T只能出现在out位置上，而不能出现在in位置

**实例**

```kotlin
//在T前使用out关键字声明表示T只能出现在out位置上
class SimpleData<out T>(val data:T?){
    fun get():T?{
        return data
    }
}
```

```kotlin
fun main(){
    val student=Student("Tom",19)
    val data=SimpleData<Student>(student)
    handleMyData(data)
    val studentData=data.get()
}
fun handleMyData(data:SimpleData<Person>){
    val personData=data.get()
}
```

### 泛型的逆变

**定义**

假如定义一个MyClass<T>的泛型类，其中A是B的子类型，同时MyClass<B>是MyClass<A>的子类型，就称MyClass在T这个泛型上是逆变的

**条件**

泛型T前加上in关键字声明，简而言之，T只能出现在in位置上，而不能出现在out位置

**实例**

```kotlin
//在T前使用out关键字声明表示T只能出现在out位置上
interface Transformer<in T>{
    fun transform(t:T):String
}
```

```kotlin
fun main(){
    val trans=object:Transformer<Person>{
        override fun transform(t:Person):String{
            return "${t.name} ${t.age}"
        }
    }
    handleTransformer(trans)
}
handleTransformer(trans:Transformer<Student>){
        val student=Student("Tom",19)
    	val result=trans.transform(student)
    }
```

------

