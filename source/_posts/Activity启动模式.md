---
title: Activity启动模式
date: 2025-09-27 19:02:53
categories:
- Android进阶
tags:
---

### 什么是Activity所需要的任务栈？

“Activity 所需要的任务栈”这个说法的背后，其实是在讨论一个核心概念：**`taskAffinity`（任务相关性）**。

简单来说，**“Activity 所需要的任务栈”** 就是指 **一个 Activity “期望”或“倾向于”在哪个任务栈（Task）中运行。**

这个“期望”就是由 `taskAffinity` 这个属性来定义的。一般情况下任务栈的名字为应用的包名，也可以单独为Activity指定taskAffinity属性值，这个属性不能和包名相同。

### 指定Activity启动模式

**方法一**

通过AndroidMenifest为Activity指定启动模式

```xml
<activity
            android:name=".SecondActivity"
            android:configChanges="screenLayout"
            android:launchMode="singleTask"
            android:label="@string/app_name"
            />
```

**方法二**

通过在Intent中设置标置位启动

```java
Intent intent=new Intent();
intent.setClass(MainActivity.this,SecondActivity.class);
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
startActivity(intent);
```

**两种方法的区别**

- 优先级：方法二>方法一
- 限定范围：方法一无法直接为Activity设定FLAG_ACTIVITY_CLEAR_TOP标识，而方法二无法为Activity指定singleInstance模式

### Activity的Flags

1. **FLAG_ACTIVITY_NEW_TASK**

   为Activity指定singleTask启动模式

2. **FLAG_ACTIVITY_SINGLE_TOP**

   为Activity指定singleTop启动模式

3. **FLAG_ACTIVITY_CLEAR_TOP**

   具有此标记位的activity当他启动时同一个任务栈中位于他上面的Activity都要出栈，这个标记位一般和singleTask启动模式一起出现

4. **FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS**

   具有这个标记的Activity不会出现在历史的Activity列表中，当某些情况下我们不希望用户通过历史列表回到我们的Activity的时候这个标记比较有用

   

### IntentFilter的匹配规则

- **action的匹配规则**

  Intent中的action必须能和过滤规则中的action匹配，这里说的匹配是指action字符串的值完全一样。一个过滤规则可以有多个action，只要Intent中的action能和其中任何一个action相同即可匹配成功。总之，Intent中的action必须存在且能匹配，并且action要区分大小写

- **category匹配规则**

  要么不设置，如果设置了就必须和过滤规则中的任何一个相同。不设置是因为系统用startActivity和startActivityForResult时会默认为Intent加上默认的category，同时为了接收隐式调用也需要在过滤规则中表明这个默认的category

- **data匹配规则**

  data匹配规则和action类似，如果过滤规则中定义了data，那么Intent中必须也要定义可匹配的data

  1. 不指定URI时会有默认值一般是content或者file

     ```xml
      		   <intent-filter>
                     <data android:mimeType="image/*"/>
                 </intent-filter>
     ```

     ```java
        	intent.setDataAndType(Uri.parse("file://abc"),"image/png")//必须调用setDataAndType方法，调用setData或者setType会彼此清除对方的值
     ```

     

  2. 指定完整的属性值

     ```xml
     		   <intent-filter>
                     <data android:mimeType="video/mpeg" android:scheme="https" .../>
                     <data android:mimeType="audio/mpeg" android:scheme="https" .../>
                     ...
                 </intent-filter>
     ```

     ```java
     intent.setDataAndType(Uri.parse("https://abc"),"video/mpeg")
     ```

     或者

     ```java
     intent.setDataAndType(Uri.parse("https://abc"),"audio/mpeg")
     ```

     

  3. 以下两种写法作用一样

     ```xml
     		   <intent-filter>
                     <data android:scheme="file" android:host="www.baidu.com"/>  
                     ...
                 </intent-filter>
     		   <intent-filter>
                     <data android:scheme="file"/>
                     <data android:host="www.baidu.com"/>
                     ...
                 </intent-filter>
     ```

     

- **data的结构**

  1. 语法如下：

     ```xml
     <data android:scheme="string"
         	android:host="string"
             android:port="80"
             android:path="/string"
             android:pathPattern="string"
             android:pathPrefix="/string"
             android:mimeType="string"/>
     ```

  2. data由两部分组成：miniType和URI，miniType指媒体类型，比如image/jpeg、video/*等
     URI结构：<scheme>://<host>:<port>/[<path>|<pathPrefix>|<pathPattern>]
     URI例子：http://www.baidu.com:80/search/info

     - Scheme： URI的模式，比如http、file、content等，如果URI中没有指定scheme，那么整个URI的其他参数将无效，意味着URI也无效。
     - Host： URI的主机名，比如www.baidu.com，如果host未指定，那么整个URI中的其他参数无效，意味着URI也是无效的。
     - Port： URI的端口号，仅当URI中指定了scheme和host参数的时候，port才是有意义的。
     - Path、     pathPattern    和        pathPrefix：这三个参数表述路径的信息，其中path表示完整的路径信息，pathPattern   也表示完整的路径信息，但是它里面可以包含通配符“”，“”表示0个或多个任意字符（由于正则表达式的规范，如果想表示真实的字符串，那么“”要写成“\”，“\”要写成"\\"，pathPattern    表示路径的前缀信息）



