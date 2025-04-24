---
title: Git
date: 2025-03-11 14:56:07
categories:
  - Git
tags:
---

# 创建代码仓库

首先配置身份，利用：

`git config --global user.name  "  "`

`git config --global user.email  "  "`

可以利用`git config --list`对配置信息进行查看

然后进入到想要创建仓库的相应项目文件中利用 cd 

然后在该目录中输入`git init`

项目创建完成后会在目录中生成一个隐藏的**.git**文件夹，这个文件夹用来记录本地所有的Git操作，可以通过**ls -al**命令来查看

如果想删除该仓库，只需删除这个文件夹即可

------



# 提交本地代码

可以使用**add**和**commit**提交

add是先将想要提交的代码添加进来，commit则是真正的去执行提交操作

添加单个文件：git add+文件名

添加目录：git add+目录名

添加所有文件：`git add .`

提交：`git commit -m "First commit."`一定要有-m加上提交的描述信息。

------

# 忽略文件

如果不想把app文件下的内容添加到版本控制中，那么可以修改**app/.gitignore**文件中的内容：

/build

/src/test

/src/androidTest

现在就可以提交代码：

`git add .`

`git commit -m "First commit."`

------

# 查看修改内容

1.在项目根目录下输入以下指令：

*git status*

2.修改数据后再次使用该指令可以发现文件已更改

3.利用git diff app/src/main/java/com/example/providertest/MainActivity.java查看更改的内容

------

# 撤销未提交的修改

1.利用git checkout app/src/main/java/com/example/providertest/MainActivity.java指令可以使一切修改撤销

2.输入*git status*进行检查

3.不过这种撤销方式只适合于那些没有执行过add添加的文件

如果是已经添加过的文件需要先使用`git reset app/src/main/java/com/example/providertest/MainActivity.java`指令取消添加

------

# 查看提交记录

1.用git log查看历史提交信息

2.若只想查其中一条记录，可以在命令中指定该条记录的id并加上**-1**参数表示只想看到这一行

3.如果想看这条记录具体修改了什么可以加个 **-p**，其中减号代表删除，加号代表添加的部分。

------

