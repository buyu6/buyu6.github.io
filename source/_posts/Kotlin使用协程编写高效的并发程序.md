---
title: Kotlin使用协程编写高效的并发程序
date: 2025-06-05 21:42:16
categories:
- Kotlin
tags:
---

### 协程的基本用法

- **优点**

  协程允许我们在单线程模式下模拟多线程编程的效果

- **依赖库**

  ```kotlin
  // Gradle 依赖
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
  //Android扩展
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
  ```

- **Global.launch函数创建协程作用域**

  - Global.launch创建的是一个顶层协程，这种协程当应用程序结束时也会跟着结束
  - 使用Thread.sleep可以让主线程堵塞一定时长
  - delay()可以让当前协程延长指定时间后再运行，是一个非阻塞式的挂起函数，只会挂起当前协程，对其他线程或协程无影响
  - 最大的问题就是可能代码还没运行结束应用程序就结束了，代码运行强制中断

  ```kotlin
   GlobalScope.launch {
          println("codes run in coroutine scope")
          delay(1500)
          println("codes run in coroutine scope finished")
      }
      Thread.sleep(1000)
  ```

- **runBlocking函数**

  - 可以保证作用域内所有代码和子线程未执行完之前一直阻塞当前线程
  - **需要注意**runBlocking 一般只在测试环境使用，正式环境容易出现性能问题
  - 可以在作用域中使用launch函数创建多个协程
  - **子线程的特点**如果外层作用域协程结束子线程也会结束

  ```kotlin
  runBlocking {
              launch {
                  println("launch1")
                  delay(1000)
                  println("launch1 finished")
              }
              launch {
                  println("launch2")
                  delay(1000)
                  println("launch2 finished")
              }
  ```

- **suspend关键字**

  - 可以将任何函数声明成挂起函数
  - 无法提供协程作用域

  ```kotlin
  suspend fun printDot(){
      println(".")
      delay(1000)
  }
  ```

- **coroutineScope函数**

  会继承外部的协程的作用域并创建一个子协程

  ```kotlin
  suspend fun printDot()=coroutineScope{
      launch{
      println(".")
      delay(1000)
      }
  }
  ```

- **coroutineScope函数和runBlocking函数的区别**
  - coroutineScope将外部协程挂起，当作用域内代码执行完毕coroutineScope函数之后的代码才可以执行
  - coroutineScope函数只会阻塞当前线程既不影响其他协程又不影响其他线程，因此不会造成任何性能上的问题
  - runBlocking会造成性能上的问题，不推荐在项目中使用

------

### 更多的作用域构建器

- **实际项目中常用写法**

  ```kotlin
  val job=Job()
  val scope=CoroutineScope(job)
  scope.launch{
      //处理具体逻辑
  }
  job.cancel()
  ```

  这样创建所有调用CoroutineScope的launch函数所创建的协程，都会被关联在Job对象作用域下，这样只需调用一次cancel就可以将同一作用域内的所有协程全部取消

- **async获取执行结果**

  - async必须在协程作用域中调用
  - 创建一个新的协程并返回一个Deferred对象，并调用await()方法获取结果
  - 在最后一起调用await方法可以大大提高效率，会使两个async函数变为并行关系

  ```kotlin
  fun main(){
      /*runBlocking {
          val result=async {
              5+5
          }.await()
          println(result)
      }*/
      runBlocking {
          val result1=async {
              5+5
          }
          val result2=async {
              4+6
          }
          println("result is ${result1.await()+result2.await()}")
      }
  }
  
  ```

- **withContext()函数(async函数的简化版)**

  - 当代码全部执行完会将最后一行结果作为返回值返回
  - 强制要求指定一个线程参数
  - 线程参数有三个可选值：Dispatchers.Default,Dispatchers.IO和Dispatchers.Main.Dispatchers.Default表示默认低并发策略，当执行代码属于计算密集型任务时，开启过高的并发反而影响效率。Dispatchers.IO表示较高并发的线程策略，执行代码大多数时间在阻塞和等待中。Dispatchers.Main表示不会开启子线程，但这个值只能在Android项目中使用，纯Kotlin程序中使用会出错。
  
  ```kotlin
  fun main(){
      runBlocking {
          val result= withContext(Dispatchers.Default){
              5+5
          }
          println(result)
      }
  }
  ```
  

------

### 使用协程简化回调方法

- **发送网络请求的回调**

  - suspendCoroutine函数必须在协程作用域或挂起函数中才能调用，主要作用是把当前协程立刻挂起，然后在普通线程中执行lambda表达式代码
  - Lambda表达式会传入continuation参数，调用他的resume方法或resumeWithException方法可以使协程恢复

  ```kotlin
   suspend  fun request(adress:String):String{
          return suspendCoroutine {
              continuation ->
             HttpUtil.sendRequestWithHttpURLConnection(adress,object:HttpCallbackListener{
                 override fun onFinish(response: String) {
                     continuation.resume(response)
                 }
  
                 override fun onError(e: Exception) {
                     continuation.resumeWithException(e)
                 }
             })
          }
      }
  //调用
      suspend  fun getBaiduResponse(){
          try{
              val response=request("http://www.baidu.com/")
              //对服务器响应数据进行处理
          }catch(e:Exception){
              //对异常情况处理
          }
      }
  ```

- **Retrofit发送请求的回调**

  ```kotlin
  suspend fun<T> Call<T>.await():T{
      return suspendCoroutine{continuation ->
                              enqueue(object:Callback<T>{
                                   override fun onResponse(
                      call: Call<T>,
                      response: Response<T>
                  ) {
                    val body=response.body()
                    if(body!=null){
                        continuation.resume(body)
                    } 
                   else   continuation.resumeWithException(
                       RuntimeException("response body is null")
                   )                 
                  }
                  override fun onFailure(call: Call<T>, t:Throwable) {
                    continuation.resumeWithException(t)
                  }
                              })
          
      }
  }
  //调用
  suspend fun getAppData(){
      try{
          val appList=ServiceCreator.create<AppService>().getAppData().await()
          //对服务器响应的数据进行处理
      }catch(e:Exception){
          //对异常进行处理
      }
  }
  ```

  

------

