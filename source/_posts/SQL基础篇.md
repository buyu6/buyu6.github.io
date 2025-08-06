---
title: SQL基础篇
date: 2025-08-02 17:20:11
categories:
- 数据库(SQL)
tags:
---

# SQL通用语法及其分类

### 通用语法

![](../img/img62.png)

### 分类

![](../img/img63.png)

------

# DDL

### 数据库操作

- **查询**

  ```sql
  show databases;#查询所有数据库
  select database();#查询当前数据库
  ```

- **创建**

  ```sql
  create database [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET 字符集] [COLLATE 排列规则];
  ```

- **删除**

  ```sql
  DROP DATABASE [IF EXISTS] 数据库名;
  ```

- **使用**

  ```sql
  USE 数据库名;
  ```

### 表操作

- **查询**

  ```sql
  SHOW TABLES;#查询当前数据库所有表格
  DESC 表名;#查询表结构
  SHOW CREATE TABLE 表名;#查询指定表的建表语句
  ```

- **创建**

  ```sql
  CREATE TABLE 表名(
  	字段1 字段1类型[COMMENT 字段1注释]
      字段2 字段2类型[COMMENT 字段2注释]
      字段3 字段3类型[COMMENT 字段3注释]
      . . . . . . .
      字段n 字段n类型[COMMENT 字段n注释]
  )[COMMENT 表注释]
  ```

- **修改**

  ```sql
  ALTER TABLE 表名 ADD 字段名 类型(长度) [COMMENT 注释] [约束];#添加字段
  ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);#修改数据类型
  ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度) [COMMENT 注释] [约束];#修改字段名和字段类型
  ALTER TABLE 表名 RENAME TO 新表名;#修改表名
  ```

- **删除**

  ```sql
  alter table 表名 drop 字段名;#删除字段
  drop table [if exists] 表名;#删除表
  truncate table 表名;#删除指定表，并重新创建该表
  ```

  

### 数据类型

- **字符串类型**

  ![](../img/img64.png)

- **数值类型**

  ![](../img/img65.png)

- **日期类型**

  ![](../img/img66.png)

------

# DML

### 添加数据

![](../img/img67.png)

### 修改数据

![](../img/img68.png)

### 删除数据

![](../img/img69.png)

------

# DQL

### 通用语法

![](../img/img70.png)

### 基本查询

![](../img/img71.png)

### 条件查询

![](../img/img72.png)

### 聚合函数

![](../img/img73.png)

### 分组查询

![](../img/img74.png)

### 排序查询

![](../img/img75.png)

### 分页查询

![](../img/img76.png)

### 执行顺序

![](../img/img77.png)

------

# DCL

### 用户管理

![](../img/img78.png)

### 权限控制

![](../img/img79.png)

![](../img/img80.png)

------

