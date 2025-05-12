---
title: 探究ContentProvider(Kotlin)
date: 2025-05-11 22:08:37
categories:
- Android(Kotlin版)
tags:
---

# 运行时权限

### 权限机制

- **分类**

  普通权限和危险权限（还包括一些特殊权限但使用不多，不参与讨论）

- **危险权限**

  ![](../img/img56.jpg)

- **特点**

  普通权限直接在AndroidManifest.xml中声明即可

  危险权限需要进行运行时权限处理

  原则上用户一旦同意某一个权限申请，同组的其它权限会自动授权，但不要基于此规则来实现任何逻辑功能

### 运行时申请权限

1.在AndroidManifest.xml中声明权限

```kotlin
<uses-permission android:name="android.permission.CALL_PHONE"/>
```

2.检查权限是否授权

```kotlin
 if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
              // 修正权限请求的字符串格式
                ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CALL_PHONE), 1) 
            } else {
                call()
            }
```

3.调用onRequestPermissionsResult()方法申请授权

```kotlin
override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when(requestCode){
            1->{
                if(grantResults.isNotEmpty()&&grantResults[0]==PackageManager.PERMISSION_GRANTED){
                    call()
                }else{
                   Toast.makeText(this, "You denied the permission", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
```

4.把权限授权后执行的逻辑封装

```kotlin
 private fun call() {
        try {
            val intent=Intent(Intent.ACTION_CALL)
            intent.data=Uri.parse("tel:10086")
            startActivity(intent)
        }catch (e:SecurityException){
            e.printStackTrace()
        }
    }
```

------

# ContentProvider基本用法

 **1.获取 ContentResolver 实例**

在 Android 中，通常通过上下文（Context）来获取 ContentResolver 实例：

```kotlin
val contentResolver = context.contentResolver
```

**2.添加数据**

`insert()` 方法用于在 ContentProvider 中插入新数据，参数说明如下：

- **uri**：目标数据的 URI

- **ContentValues**：存储键值对数据

  ```kotlin
  val uri = Uri.parse("content://com.example.app.provider/city")
  val values = ContentValues().apply {
      put("name", "Beijing")
      put("code", "BJ")
  }
  val newUri = contentResolver.insert(uri, values)
  println("插入成功，新记录URI：$newUri")
  ```

**3.删除数据**

`delete()` 方法用于删除 ContentProvider 中的数据，参数说明如下：

- **uri**：目标数据的 URI

- **selection**：删除条件

- **selectionArgs**：条件参数数组

  ```kotlin
  val uri = Uri.parse("content://com.example.app.provider/city")
  val selection = "id = ?"
  val selectionArgs = arrayOf("1")
  val deleteCount = contentResolver.delete(uri, selection, selectionArgs)
  println("删除了 $deleteCount 条记录")
  ```

**4.查询数据**

`query()` 方法用于从 ContentProvider 查询数据，参数说明如下：

- **uri**：需要访问的数据的 URI，例如：`content://com.example.app.provider/city`

- **projection**：需要查询的列数组，如果传入 null，则返回所有列

- **selection**：过滤条件（WHERE 子句），可使用 ? 占位符

- **selectionArgs**：过滤条件对应的参数数组

- **sortOrder**：排序规则

  ```kotlin
  val uri = Uri.parse("content://com.example.app.provider/city")
  val projection = arrayOf("id", "name", "code")
  val cursor = contentResolver.query(uri, projection, null, null, "id ASC")
  cursor?.use {
      while (it.moveToNext()) {
          val id = it.getInt(it.getColumnIndexOrThrow("id"))
          val name = it.getString(it.getColumnIndexOrThrow("name"))
          val code = it.getString(it.getColumnIndexOrThrow("code"))
          println("City: id=$id, name=$name, code=$code")
      }
  }
  ```

**5.更新数据**

`update()` 方法用于更新 ContentProvider 中的数据，参数说明如下：

- **uri**：目标数据的 URI

- **ContentValues**：存储需要更新的字段和值

- **selection**：指定更新条件

- **selectionArgs**：条件参数数组

  ```kotlin
  val uri = Uri.parse("content://com.example.app.provider/city")
  val values = ContentValues().apply {
      put("name", "Shanghai")
  }
  val selection = "id = ?"
  val selectionArgs = arrayOf("1")
  val updateCount = contentResolver.update(uri, values, selection, selectionArgs)
  println("更新了 $updateCount 条记录")
  ```

------

# 创建ContentProvider

- **新建一个类继承ContentProvider并重写6个方法(onCreate(),query(),insert(),update(),delete(),getType())**
- **实现数据操作**
  - **query()**：根据传入的 URI 查询数据，并返回一个 Cursor 对象。
  - **insert()**：根据传入的 URI 插入数据，返回新插入数据的 URI。
  - **update()**：根据 URI 更新数据，返回受影响的行数。
  - **delete()**：根据 URI 删除数据，返回删除的行数。
  - **getType()**：返回指定 URI 对应的数据 MIME 类型。

- **配置 URI 匹配器 使用 `UriMatcher` 对传入的 URI 进行匹配，以便确定请求类型并执行相应操作。可以在静态代码块中添加匹配规则**

```kotlin
private static final UriMatcher uriMatcher = new UriMatcher(UriMatcher.NO_MATCH);
init {
    uriMatcher.addURI("your.authority", "your_path", CODE_CONSTANT);
}
```

- **在 AndroidManifest.xml 中注册 ContentProvider** 在清单文件中注册你的 ContentProvider：

```kotlin
<provider
    android:name=".YourContentProvider"
    android:authorities="your.authority"
    android:exported="true" />
```

**注意**：`android:exported` 的值根据你的需求设置为 `true` 或 `false`。

- **通配符**

  *表示匹配任意长度的任意字符

  #表示匹配任意长度的数字

- **MIME字符串组成**
  1. vnd开头
  2. 如果内容URI以路径结尾则接**android.cursor.dir/**，如果内容URI以id结尾则接**android.cursor.item/**
  3. 最后接上vnd.<authority>.<path>

```kotlin
/**
 * 数据库内容提供器
 * 用于对外共享数据库中的数据，实现跨应用数据访问
 */
class DatabaseProvider : ContentProvider() {
    // URI匹配码
    private val bookDir = 0      // 访问图书表中的所有数据
    private val bookItem = 1     // 访问图书表中的单条数据
    private val categoryDir = 2  // 访问分类表中的所有数据
    private val categoryItem = 3 // 访问分类表中的单条数据
    
    // 内容提供器的唯一标识
    private val authority = "com.example.databasetest.provider"
    // 数据库帮助类实例
    private var dbHelper: MyDatabaseHelper? = null
    
    /**
     * 懒加载初始化UriMatcher
     * 用于匹配内容URI，分别添加四种URI匹配规则
     */
    private val uriMatcher by lazy {
        val matcher = UriMatcher(UriMatcher.NO_MATCH)
        matcher.addURI(authority, "book", bookDir)         // content://com.example.databasetest.provider/book
        matcher.addURI(authority, "book/#", bookItem)      // content://com.example.databasetest.provider/book/1
        matcher.addURI(authority, "category", categoryDir) // content://com.example.databasetest.provider/category
        matcher.addURI(authority, "category/#", categoryItem) // content://com.example.databasetest.provider/category/1
        matcher
    }

    /**
     * 删除数据
     * @param uri 待删除数据的URI
     * @param selection WHERE约束条件
     * @param selectionArgs WHERE约束条件的参数
     * @return 删除的行数
     */
    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?) = dbHelper?.let {
        val db = it.writableDatabase
        val deletedRows = when (uriMatcher.match(uri)) {
            bookDir -> db.delete("Book", selection, selectionArgs)
            bookItem -> {
                val bookId = uri.pathSegments[1]  // 获取图书id
                db.delete("Book", "id = ?", arrayOf(bookId))
            }
            categoryDir -> db.delete("Category", selection, selectionArgs)
            categoryItem -> {
                val categoryId = uri.pathSegments[1]  // 获取分类id
                db.delete("Category", "id = ?", arrayOf(categoryId))
            }
            else -> 0
        }
        deletedRows
    } ?: 0

    /**
     * 根据URI返回MIME类型
     * vnd.android.cursor.dir/表示返回多条数据
     * vnd.android.cursor.item/表示返回单条数据
     */
    override fun getType(uri: Uri) = when (uriMatcher.match(uri)) {
        bookDir -> "vnd.android.cursor.dir/vnd.com.example.databasetest.provider.book"
        bookItem -> "vnd.android.cursor.item/vnd.com.example.databasetest.provider.book"
        categoryDir -> "vnd.android.cursor.dir/vnd.com.example.databasetest.provider.category"
        categoryItem -> "vnd.android.cursor.item/vnd.com.example.databasetest.provider.category"
        else -> null
    }

    /**
     * 插入数据
     * @param uri 待插入的位置
     * @param values 待插入的数据
     * @return 新插入数据的URI
     */
    override fun insert(uri: Uri, values: ContentValues?) = dbHelper?.let {
        val db = it.writableDatabase
        val uriReturn = when(uriMatcher.match(uri)) {
            bookDir, bookItem -> {
                val newBookId = db.insert("Book", null, values)
                Uri.parse("content://$authority/book/$newBookId")
            }
            categoryDir, categoryItem -> {
                val newCategoryId = db.insert("Category", null, values)
                Uri.parse("content://$authority/category/$newCategoryId")
            }
            else -> null
        }
        uriReturn
    }

    /**
     * 初始化内容提供器
     * @return 初始化是否成功
     */
    override fun onCreate() = context?.let {
        dbHelper = MyDatabaseHelper(it, "BookStore.db", 2)
        true
    } ?: false

    /**
     * 查询数据
     * @param uri 查询的URI
     * @param projection 查询的列名
     * @param selection WHERE约束条件
     * @param selectionArgs WHERE约束条件的参数
     * @param sortOrder 排序方式
     * @return 查询的结果集
     */
    override fun query(
        uri: Uri, projection: Array<String>?, selection: String?,
        selectionArgs: Array<String>?, sortOrder: String?
    ) = dbHelper?.let {
        val db = it.readableDatabase
        val cursor = when(uriMatcher.match(uri)) {
            bookDir -> db.query("Book", projection, selection, selectionArgs, null, null, sortOrder)
            bookItem -> {
                val bookId = uri.pathSegments[1]
                db.query("Book", projection, "id=?", arrayOf(bookId), null, null, sortOrder)
            }
            categoryDir -> db.query("Category", projection, selection, selectionArgs, null, null, sortOrder)
            categoryItem -> {
                val categoryId = uri.pathSegments[1]
                db.query("Category", projection, "id=?", arrayOf(categoryId), null, null, sortOrder)
            }
            else -> null
        }
        cursor
    }

    /**
     * 更新数据
     * @param uri 更新的URI
     * @param values 新的值
     * @param selection WHERE约束条件
     * @param selectionArgs WHERE约束条件的参数
     * @return 更新的行数
     */
    override fun update(
        uri: Uri, values: ContentValues?, selection: String?,
        selectionArgs: Array<String>?
    ) = dbHelper?.let {
        val db = it.writableDatabase
        val updatedRows = when(uriMatcher.match(uri)) {
            bookDir -> db.update("Book", values, selection, selectionArgs)
            bookItem -> {
                val bookId = uri.pathSegments[1]
                db.update("Book", values, "id=?", arrayOf(bookId))
            }
            categoryDir -> db.update("Category", values, selection, selectionArgs)
            categoryItem -> {
                val categoryId = uri.pathSegments[1]
                db.update("Category", values, "id=?", arrayOf(categoryId))
            }
            else -> 0
        }
        updatedRows
    } ?: 0
}
```

------

