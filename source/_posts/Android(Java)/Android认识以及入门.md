---
title: Android认识以及入门
date: 2025-02-24 20:28:01
categories:
- Android(Java版)
tags:

---

# 系统架构



1.Linux内核层:提供底层驱动
2.系统运行库层:提供主要的特性支持(通过C/C++库)，同样这一层也有Android运行时库，提供了一些核心库，能允许开发者使用Java来编写应用。
3.应用框架层:提供了各种API
4.应用层:安装到手机上的应用程序都属于这一层

---



# Android应用开发特色



1.四大组件:活动，服务，广播接收器，内容提供器。
2.丰富的系统控件
3.SQLite数据库:让存储数据和读取数据变得更为方便
4.强大的多媒体
5.地理位置定位

---



# 项目中各个文件的作用



1.gradle:里面含有gradle wrapper配置文件，需要打开的话必须手动按照“导航栏~File~Settings~Bulid,Execution,Deployment~Gradle”这个步骤进行
2..gitignore:将指定的目录或文件排除在版本控制之外。
3.gradle.properties:这个文件是全局的gradle配置文件，在这里配置的属性将会影响到项目中所有的gradle编译脚本。
4.gradlew和gradlew.bat:用来在命令行界面中执行gradle命令的，其中gradle是在Linux或Mac系统使用，gradlew.bat在Windows系统使用



[^]: ***无需修改或使用的文件这里不做赘述(主要起作用的是app当中文件这里放在下一节进行详细论述)***

---

# app目录详解



1.libs:jar包存放的地方
2.Androidtest:编写测试用例，对项目进行自动化测试
3.Java:放置Java代码的地方
4.res:
①图片放在drawable中
②布局放在layout中
③字符串，样式，颜色等配置放在values中
④mipmap中放置一些图标
5.AndroidManifest.xml:整个Android项目配置文件，四大组件和活动等都需要在这里注册，经常会使用到这个文件。
6.test:编写测试用例，是对项目自动化测试的另一种方式
7.build.gradle:这个文件中会指定很多项目构建相关的配置
8.proguard-rules.pro:指定项目代码的混淆规则

[^]: ***做项目基本在这个文件里进行修改(没多大作用的不再讲解***

---

# 主活动的设定



即首先启动的活动

```java
<intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
</intent-filter>
```

---

# 引用的方法



1.R.string.hello_world
2.@string/hello_world
如果在@和string之间添上一个+就变成了定义
其中的string可以替换

---

# 日志工具



从小到大的顺序
Log.v:打印意义最小的信息
Log.d:打印调试信息
Log.i:比较重要的数据
Log.w:警告信息
Log.e:错误信息
传入两个参数:第一个参数是tag，一般传入类名就好主要用于对打印信息的过滤
第二个参数是msg，即想要打印的内容
一般与logcat结合使用

---
