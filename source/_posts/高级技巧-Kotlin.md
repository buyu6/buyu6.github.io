---
title: 高级技巧(Kotlin)
date: 2025-06-27 02:02:24
categories:
- Android(Kotlin版)
tags:
---

# 全局获取Context的技巧

```kotlin
class MyApplication : Application() {
    companion object {
        @SuppressLint("StaticFieldLeak")
        lateinit var context: Context
    }
    override fun onCreate() {
        super.onCreate()
        context = applicationContext
    }
}
```

```kotlin
<application
        android:name=".MyApplication"
```

```kotlin
Toast.makeText(MyApplication.context, "onCreate", Toast.LENGTH_SHORT).show()
```

------

# Intent传递对象

### Serializable方式

- **特点**：`Serializable` 是 Java 提供的一个接口，它标志着一个类可以被序列化

- **用法**：

  ```kotlin
  // 定义一个可以序列化的对象
  data class User(val name: String, val age: Int) : Serializable
  
  // 在第一个Activity中传递对象
  val user = User("John", 30)
  val intent = Intent(this, SecondActivity::class.java)
  intent.putExtra("user_data", user)
  startActivity(intent)
  
  // 在第二个Activity中接收对象
  val user = intent.getSerializableExtra("user_data") as User
  ```

### Parcelable方式

- **特点**：`Parcelable` 是 Android 提供的一种对象序列化机制，它与 `Serializable` 类似，目的是将对象转换为可以通过 `Intent` 或 `Bundle` 等传递的字节流，但它的实现更加高效。与 Java 标准的 `Serializable` 相比，`Parcelable` 更加高效，因为它不会依赖于反射，使用了特定的内存块和优化的序列化方式。

- **用法**：

  ```kotlin
  // 定义一个实现 Parcelable 的对象
  data class User() : Parcelable {
      val name=""
      val age=0
      override fun writeToParcel(parcel: Parcel, flags: Int) {
          parcel.writeString(name)//写出name
          parcel.writeInt(age)//写出age
      }
  
      override fun describeContents(): Int = 0
  
      companion object  CREATOR: Parcelable.Creator<User>{
              override fun createFromParcel(parcel: Parcel): User {
                  val user = User()
                 user.name=parcel.readString()?:""//读取name
                  user.age=parcel.readInt()//读取age
                  return user
              }
  
              override fun newArray(size: Int): Array<User?> {
                  return arrayOfNulls(size)
              }
          }
      
  }
  
  // 在第一个Activity中传递对象
  val user = User()
  user.name="John"
  user.age=18
  val intent = Intent(this, SecondActivity::class.java)
  intent.putExtra("user_data", user)
  startActivity(intent)
  // 在第二个Activity中接收对象
  val user = intent.getParcelableExtra("user_data") as User
  ```

  **注意**：这里的读取顺序和写出的顺序一定要完全相同

  更简单的方法：

  ```kotlin
  @Parcelable
  class Person(var name:String,var age:Int):Parcelable
  ```

------

# 定制自己的日志工具

- 开发阶段将level指定成VERBOSE，正式上线时将其指定成ERROR

```kotlin
object LogUtil {
    private const val VERBOSE = 1
    private const val DEBUG = 2
    private const val INFO = 3
    private const val WARN = 4
    private const val ERROR = 5
    private var level = VERBOSE
    fun v(tag: String, msg: String) {
        if (level <= VERBOSE) {
            Log.v(tag, msg)
        }
    }
    fun d(tag: String, msg: String) {
        if (level <= DEBUG) {
            Log.d(tag, msg)
        }
    }
    fun i(tag: String, msg: String) {
        if (level <= INFO) {
            Log.i(tag, msg)
        }
    }
    fun w(tag: String, msg: String) {
        if (level <= WARN) {
            Log.w(tag, msg)
        }
    }
    fun e(tag: String, msg: String) {
        if (level <= ERROR) {
            Log.e(tag, msg)
        }
    }
}
```

```kotlin
LogUtil.d("TAG", "debug log")
```

------

# 深色主题

```kotlin
fun toggleTheme() {
    val currentMode = AppCompatDelegate.getDefaultNightMode()

    if (currentMode == AppCompatDelegate.MODE_NIGHT_YES) {
        // 当前是深色主题，切换到浅色主题
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
    } else {
        // 当前是浅色主题，切换到深色主题
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
    }

    // 你可以在这里保存用户的选择，以便下次启动时保持一致
    val sharedPreferences = getSharedPreferences("settings", MODE_PRIVATE)
    val editor = sharedPreferences.edit()
    editor.putBoolean("dark_mode", currentMode == AppCompatDelegate.MODE_NIGHT_YES)
    editor.apply()
}

```

------

