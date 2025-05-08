---
title: Kotlin高阶函数的应用
date: 2025-05-08 00:06:10
categories:
- Kotlin
tags:
---

# 简化SharedPreferences的用法

- 通过扩展函数方式像其中添加open函数

- 接收函数类型

  ```kotlin
  fun SharedPreferences.open(block:SharedPreferences.Editor.()->Unit){
      val editor=edit()
      editor.block()
      editor.apply()
  }
  ```

  ```kotlin
  //调用
  getSharedPreferences("data",Context.MODE_PRIVATE).open{
      putString("name","Tom")
      putInt("age",19)
      putBoolean("married",false)
  }
  ```

Android Studio自带扩展可以直接使用：

```kotlin
getSharedPreferences("data",Context.MODE_PRIVATE).edit{
    putString("name","Tom")
    putInt("age",19)
    putBoolean("married",false)
}
```

------



# 简化ContentValues的用法

- 定义cvOf方法

- 获取ContentValues对象

- 遍历pairs列表

- 利用when语句意义判断数值类型

  **varage关键字：**对应java的可变参数列表

  **Pair：**键值对数据结构，由于数值类型多所以指定为**Any?**相当于java中的**Object**

  ```kotlin
  fun cvOf(vararg pairs:Pair<String,Any?>):ContentValues{
      val cv=ContentValues()
      for(pair in pairs){
          val key=pair.first
          val value=pair.second
          when(value){
              is Int->cv.put(key, value)
              is Long->cv.put(key, value)
              is Short->cv.put(key, value)
              is Float->cv.put(key, value)
              is Double->cv.put(key, value)
              is Boolean->cv.put(key, value)
              is String->cv.put(key, value)
              is Byte->cv.put(key, value)
              is ByteArray->cv.put(key, value)
              null->cv.putNull(key)
          }
      }
      return cv
  }
  ```

  ```kotlin
  //调用
  val values=cvOf("name" to "Game of Thrones","author" to "George Martin","pages" to 720,"price" to 20.85)
  db.insert("Book",null,values)
  ```

  **利用apply简化**

  ```kotlin
  fun cvOf(vararg pairs:Pair<String,Any?>)=ContentValues().apply{
      for(pair in pairs){
          val key=pair.first
          val value=pair.second
          when(value){
              is Int->put(key, value)
              is Long->put(key, value)
              is Short->put(key, value)
              is Float->put(key, value)
              is Double->put(key, value)
              is Boolean->put(key, value)
              is String->put(key, value)
              is Byte->put(key, value)
              is ByteArray->put(key, value)
              null->putNull(key)
          }
      }
  }
  ```

  **KTX库提供同样功能的contentValuesOf方法**

  ```kotlin
  val values=contentValuesOf("name" to "Game of Thrones","author" to "George Martin","pages" to 720,"price" to 20.85)
  db.insert("Book",null,values)
  ```

------

