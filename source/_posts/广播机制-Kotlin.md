---
title: 广播机制(Kotlin)
date: 2025-05-05 20:44:19
categories:
- Android(Kotlin版)
tags:
---

# 接收系统广播

### 动态注册

```kotlin
class MainActivity : AppCompatActivity() {
    // 声明广播接收器变量
    lateinit var timeChangeReceiver:TimeChangeReceiver
    // 声明视图绑定变量
    private lateinit var binding:ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 初始化视图绑定
        binding=ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // 创建IntentFilter并添加系统时间变化的广播action
        val intentFilter=IntentFilter()
        intentFilter.addAction("android.intent.action.TIME_TICK")
        // 初始化广播接收器
        timeChangeReceiver=TimeChangeReceiver()
        // 注册广播接收器
        registerReceiver(timeChangeReceiver,intentFilter)
    }

    override fun onDestroy() {
        super.onDestroy()
        // 在Activity销毁时注销广播接收器，防止内存泄漏
        unregisterReceiver(timeChangeReceiver)
    }

    // 内部类：时间变化广播接收器
    inner class TimeChangeReceiver:BroadcastReceiver(){
        override fun onReceive(context: Context?, intent: Intent?) {
            // 当接收到时间变化的广播时，显示Toast提示
            Toast.makeText(context,"Time has changed",Toast.LENGTH_SHORT).show()
        }
    }
}
```

**查看完整的系统广播列表(查看路径)：**

**<Android SDK>/platforms/<任意 android api 版本>/data/broadcast_actions.txt**

### 静态注册

**特点**：开机自启动

**步骤**：

- 使用Android Studio创建的Broadcast Receiver,会自动注册

- 添加相应的权限并添加action属性

  ```kotlin
  class BootCompleteReceiver : BroadcastReceiver() {
  
      override fun onReceive(context: Context, intent: Intent) {
                  Toast.makeText(context,"Boot Complete",Toast.LENGTH_SHORT).show()
      }
  }
  ```

  ```kotlin
         <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
        <receiver
              android:name=".BootCompleteReceiver"
              android:enabled="true"
              android:exported="true">
              <intent-filter>
                  <action android:name="android.intent.action.BOOT_COMPLETED" />
              </intent-filter>
          </receiver>
  ```

  

------

# 发送自定义广播

### 发送标准广播

- 新建BroadcastReceiver并定义接收逻辑

- 在Manifest.xml中添加action属性

- 构建Intent对象发送广播

  ```kotlin
  class MyBroadcastReceiver : BroadcastReceiver() {
  
      override fun onReceive(context: Context, intent: Intent) {
          Toast.makeText(context,"received in MyBroadcastReceiver",Toast.LENGTH_SHORT).show()
          abortBroadcast()
      }
  }
  ```

  ```kotlin
          <receiver
              android:name=".MyBroadcastReceiver"
              android:enabled="true"
              android:exported="true">
              <intent-filter android:priority="100">
                  <action android:name="com.example.broadcasttest.MY_BROADCAST" />
              </intent-filter>
          </receiver>
  ```

  ```kotlin
  class MainActivity : AppCompatActivity() {
      // 声明视图绑定变量
      private lateinit var binding:ActivityMainBinding
  
      override fun onCreate(savedInstanceState: Bundle?) {
          super.onCreate(savedInstanceState)
          // 初始化视图绑定
          binding=ActivityMainBinding.inflate(layoutInflater)
          setContentView(binding.root)
          // 设置按钮点击事件
          binding.button.setOnClickListener {
              // 创建自定义广播Intent
              val intent=Intent("com.example.broadcasttest.MY_BROADCAST")
              // 设置包名，将隐式广播转换为显式广播（Android 8.0及以上版本要求）
              intent.setPackage(packageName)
              //发送标准广播
              sendBroadcast(intent)
          }
      }
  ```

  

### 发送有序广播

- 新建广播接收器

- 添加action属性并设置优先级

- 利用sendOrderedBroadcast()发送广播

- 在广播接收器中使用abortBroadcast()方法可以中断后续广播发送

  ```kotlin
  class AnotherBroadcastReceiver : BroadcastReceiver() {
  
      override fun onReceive(context: Context, intent: Intent) {
          Toast.makeText(context,"received in AnotherBroadcastReceiver",Toast.LENGTH_SHORT).show()
      }
  }
  ```

  ```kotlin
  <receiver
              android:name=".AnotherBroadcastReceiver"
              android:enabled="true"
              android:exported="true">
              <intent-filter>
                  <action android:name="com.example.broadcasttest.MY_BROADCAST"/>
              </intent-filter>
          </receiver>
          <receiver
              android:name=".MyBroadcastReceiver"
              android:enabled="true"
              android:exported="true">
              <intent-filter android:priority="100">//设置优先级
                  <action android:name="com.example.broadcasttest.MY_BROADCAST" />
              </intent-filter>
          </receiver>
  ```

  ```kotlin
  // 设置按钮点击事件
          binding.button.setOnClickListener {
              // 创建自定义广播Intent
              val intent=Intent("com.example.broadcasttest.MY_BROADCAST")
              // 设置包名，将隐式广播转换为显式广播（Android 8.0及以上版本要求）
              intent.setPackage(packageName)
              // 发送有序广播
              sendOrderedBroadcast(intent,null)
          }
  ```

  ```kotlin
  class MyBroadcastReceiver : BroadcastReceiver() {
  
      override fun onReceive(context: Context, intent: Intent) {
          Toast.makeText(context,"received in MyBroadcastReceiver",Toast.LENGTH_SHORT).show()
          //截断广播
          abortBroadcast()
      }
  }
  ```

  

------

