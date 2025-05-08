---
title: 数据存储(Kotlin)
date: 2025-05-08 00:01:07
categories:
- Android(Kotlin版)
tags:
---

# 文件存储

### 存储数据

- 通过openFileOutput()得到FileOutputStream对象

- 借助它构建一个OutputStreamWriter对象在借助这个构建一个BufferedWriter对象

- 利用BufferedWriter将内容写入文件

  ```kotlin
  private fun save(inputText: String) {
          try {
             val output=openFileOutput("data",Context.MODE_PRIVATE)
              val writer=BufferedWriter(OutputStreamWriter(output))
              writer.use{
                  it.write(inputText)
              }
          } catch (e: IOException) {
              e.printStackTrace()
          }
      }
  ```

  

### 读取数据

- 通过openFileInput()方法获取了一个FileInputStream对象

- 利用它构建InputStreamReader()对象再借助这个构建BufferedReader对象

- 最后利用这个对象将文件一行行读取出来并拼接到StringBuilder对象中

  ```kotlin
   private fun load(): String {
          val content = StringBuilder()
          try {
                  val input=openFileInput("data")
                  val reader=BufferedReader(InputStreamReader(input))
                      reader.use{
                          reader.forEachLine{
                              content.append(it)
                          }
                      }
          } catch (e: IOException) {
              e.printStackTrace()       
          }
          return content.toString()
      }
  ```

------

# SharedPreferences

### 存储数据

- 得到SharedPreferences对象

  (1)Context类中的getSharedPreferences()方法得到（第一个参数是文件名，第二个是模式）

  (2)Activity类中的getPreferences()方法得到（只接收模式参数）

- 调用其edit()方法得到SharedPreferences.Editor对象

- 像这个对象中添加数据

- 调用apply()提交数据

  ```kotlin
              val editor=getSharedPreferences("data", Context.MODE_PRIVATE).edit()
              editor.putString("name","Tom")
              editor.putInt("age",28)
              editor.putBoolean("married",false)
              editor.apply()
  ```

  

### 读取数据

- 得到SharedPreferences对象

- 调用get系列方法获取数据

  ```kotlin
  val prefs=getSharedPreferences("data",Context.MODE_PRIVATE)
              val name=prefs.getString("name","")
              val age=prefs.getInt("age",0)
              val married=prefs.getBoolean("married",false)
  ```

  



------

# SQLite数据库

### 创建和升级

- **创建**
  1. 新建一个类继承自SQLiteOpenHelper
  2. 建立表格
  3. 在onCreate方法中使用execSQL()方法在数据库中创建表格
  4. 在活动中使用writableDatabase方法创建数据库

- **升级**
  1. 在帮助类中建立新的表格或作出一些更改
  2. 如果建立新的表格需要在oncreate方法中用execSQL()方法创建表格
  3. 在onUpgrade()方法中使用execSQL()方法进行更新再调用onCreate()
  4. 活动中数据库版本号改为比原来大的数字

```kotlin
class MyDatabaseHelper(val context:Context,name:String,version: Int) :SQLiteOpenHelper(context,name,null,version){
   private val createBook="create table Book("+
           "id integer primary key autoincrement,"+
           "author text,"+
           "price real,"+
           "pages integer,"+
           "name text)"
    private val createCategory="create table Category("+
            "id integer primary key autoincrement,"+
            "category_name text,"+
            "category_code integer)"
    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(createBook)
        db.execSQL(createCategory)
        Toast.makeText(context,"Create succeeded",Toast.LENGTH_SHORT).show()
    }
    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
         db.execSQL("drop table if exists Book")
        db.execSQL("drop table if exists Category")
        onCreate(db)
    }
}
```

### 添加，更新，删除，查询

- **添加**

  1. 调用SQLiteOpenHelper的writableDatabase方法获取SQLiteDataBase对象

  2. 利用ContentValues()对象组装数据

  3. 利用insert方法插入数据

     ```kotlin
     binding.addData.setOnClickListener {
                 //获取SQLiteDatabase对象
                 val db=dbHelper.writableDatabase
                 //组装第一条数据
                 val values1=ContentValues().apply {
                     put("name","The Da Vinci Code")
                     put("author","Dan Brown")
                     put("pages",454)
                     put("price",16.96)
                 }
                 //插入第一条数据
                 db.insert("Book",null,values1)
                 //组装第二条数据
                 val values2=ContentValues().apply {
                     put("name","The Lost Symbol")
                     put("author","Dan Brown")
                     put("pages",510)
                     put("price",19.95)
                 }
                 //插入第二条数据
                 db.insert("Book",null,values2)
             }
     ```

- **更新**

  1. 获取SQLiteDataBase对象

  2. 获取ContentValues对象

  3. 指定更新的数据

  4. 利用update更新数据

     ```kotlin
     binding.updateData.setOnClickListener {
                 //获取SQLiteDatabase对象
                 val db=dbHelper.writableDatabase
                 val value=ContentValues()
                 value.put("price",10.99)
                 db.update("Book",value,"name=?",arrayOf("The Da Vinci Code"))
             Toast.makeText(this,"更新成功",Toast.LENGTH_SHORT).show()
             }
     ```

     

- **删除**

  1. 获取SQLiteDataBase对象

  2. 利用delete删除数据

     ```kotlin
     binding.deleteData.setOnClickListener {
                 //获取SQLiteDatabase对象
                 val db=dbHelper.writableDatabase
                 db.delete("Book","pages>?",arrayOf("500"))
                 Toast.makeText(this,"删除成功",Toast.LENGTH_SHORT).show()
             }
     ```

     

  

- **查询**

  1. 获取SQLiteDataBase对象 
  
  2. 调用query方法查询数据
  
  3. 查询后得到Cursor对象,遍历查询每一行数据在循环中通过Cursor的getColumnIndex()方法索引
  
  4. 查询完成后关闭Cursor
  
     ```kotlin
      binding.queryData.setOnClickListener {
                 //获取SQLiteDatabase对象
                 val db=dbHelper.writableDatabase
                 //查询Book中所有数据
                 val cursor=db.query("Book",null,null,null,null,null,null)
                 if(cursor.moveToFirst()){
                     do{//遍历Cursor对象，取出数据并打印
                         val name=cursor.getString(cursor.getColumnIndex("name"))
                         val author=cursor.getString(cursor.getColumnIndex("author"))
                         val pages=cursor.getInt(cursor.getColumnIndex("pages"))
                         val price=cursor.getDouble(cursor.getColumnIndex("price"))
                         Log.d("MainActivity", "book name is $name ")
                         Log.d("MainActivity", "book author is $author ")
                         Log.d("MainActivity", "book pages is $pages ")
                         Log.d("MainActivity", "book price is $price ")
                     }while (cursor.moveToNext())
     
                 }
                 cursor.close()
             }
     ```

### SQL操作数据库

```kotlin
//添加数据
db.execSQL("insert into Book(name,author,pages,price) values(?,?,?,?)",
          arrayOf("The Da Vinci Code","Dan Brown","454","16.96")
          )
db.execSQL("insert into Book(name,author,pages,price) values(?,?,?,?)",
          arrayOf("The Lost Symbol","Dan Brown","510","19.95")
          )
//更新数据
db.execSQL("update Book set price=? where name=? ",arrayOf("10.99","The Da Vinci Code"))
//删除数据
db.execSQL("delete from book where pages>?",arrayOf("500"))
//查询数据
val cursor=db.rawQuery("select * from Book",null)
```



### 使用事务

**特点**：操作要失败一起失败要成功一起成功

```kotlin
 binding.replaceData.setOnClickListener {
            //获取SQLiteDatabase对象
            val db=dbHelper.writableDatabase
            //开启事务
            db.beginTransaction()
            try {
                db.delete("Book",null,null)
                /*if(true){
                    //手动抛出异常，让事务失败
                    throw NullPointerException()
                }*/
                val values=ContentValues().apply {
                    put("name","Game of Thrones")
                    put("author","George Martin")
                    put("pages",720)
                    put("price",20.85)
                }
                db.insert("Book",null,values)
                //事务已经执行成功
                db.setTransactionSuccessful()
            }catch (e:Exception){
                e.printStackTrace()
            }finally {
                //结束事务
                db.endTransaction()
            }
        }
```



### 升级数据库最佳写法

每进行一次更新都在onUpgrade()方法中加入一个if判断语句

这样就算跨版本升级也不会出现数据丢失

```kotlin
class MyDatabaseHelper(val context:Context,name:String,version: Int) :SQLiteOpenHelper(context,name,null,version){
   private val createBook="create table Book("+
           "id integer primary key autoincrement,"+
           "author text,"+
           "price real,"+
           "pages integer,"+
           "name text,"+
           "category_id)"
    private val createCategory="create table Category("+
            "id integer primary key autoincrement,"+
            "category_name text,"+
            "category_code integer)"
    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(createBook)
        db.execSQL(createCategory)
        Toast.makeText(context,"Create succeeded",Toast.LENGTH_SHORT).show()
    }


    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        if(oldVersion<=1){
            db.execSQL(createCategory)
        }
        if(oldVersion<=2){
            db.execSQL("alter table Book add column category_id integer")
        }
    }
}
```

------

