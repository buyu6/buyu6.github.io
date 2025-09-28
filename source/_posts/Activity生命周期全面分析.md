---
title: Activity生命周期全面分析
date: 2025-09-26 19:50:22
categories:
- Android进阶
tags:
---

# 典型情况下的生命周期分析

### onStart和onResum、onPause和onStop描述上差 不多，本质上有啥不同？

- onStart和onStop是从Activity是否可见这个角度来回调的，onResum和onPause是从Activity是否位于前台这个角度来回调的

### 假设当前Activity为A，新打开一个Activity B，那么B的onResume和A的onPause哪个先执行？

- 旧的Activity先onPause然后新的Activity再启动

# 异常情况下生命周期分析

### 情况1：资源相关的系统配置发生改变导致Activity被杀死并重新创建

- 这种情况下会调用onSaveInstanceState和onRestoreInstanceState方法保存和恢复数据，系统自动为我们做了一些恢复工作
- 系统只在Activity异常终止时候才会触发这个过程，其他情况都不触发

### 情况2：资源内存不足导致低优先级的Activity被杀死

- 优先级从高到低分下面三类：
  1. 前台Activity-----正在和用户交互，优先级最高
  2. 可见但非前台-----比如Activity中弹出一个对话框，导致Activity可见但位于后台无法直接交互
  3. 后台Activity------已经被暂停的Activity，优先级最低

- 系统会按照上述优先级杀死目标Activity所在的进程，并通过onSaveInstanceState和onRestoreInstanceState方法存储和恢复数据。如果一个进程中无四大组件执行，那么这个进程很快会被系统杀死，因此一些后台工作不适合脱离四大组件而独自运行在后台，这样很容易被杀死。比较好的方法是将后台工作放入Service中从而保证进程优先级，不会被轻易杀死。

- 修改Activity的configChanges属性值可以使Activity不被重建，比如给configChanges添加orientation这个值，可以让Activity旋转后也不重新创建

- **configChanges项目及其含义**

  ![](../img/img126.jpg)

