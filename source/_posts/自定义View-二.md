---
title: 自定义View(二)
date: 2025-07-05 20:59:14
categories:
- 自定义View
tags:
---

### 目的

自定义View显示一张图片，下面包含图片的文本介绍

### 实现

- **自定义属性**

```kotlin
<resources>
    <attr name="titleText" format="string" />
    <attr name="titleTextColor" format="color" />
    <attr name="titleTextSize" format="dimension" />
    <attr name="image" format="reference"/>
    <attr name="imageScaleType">
        <enum name="fillXY" value="0" />
        <enum name="center" value="1" />
    </attr>

    <declare-styleable name="MyView">
        <attr name="titleText" />
        <attr name="titleTextColor" />
        <attr name="titleTextSize" />
        <attr name="image"/>
        <attr name="imageScaleType"/>
    </declare-styleable>
</resources>
```

- **获取自定义属性**

```kotlin
// 自定义View类，继承自View
class MyView @JvmOverloads constructor(
    context: Context, // 上下文对象
    attrs: AttributeSet? = null, // XML属性集，可为空
    defStyleAttr: Int = 0  // 默认样式属性，支持style属性
) : View(context, attrs, defStyleAttr) {
    // 声明位图变量，用于存储图片
    private var mImage: Bitmap? = null
    // 声明图片缩放类型变量
    private var mImageScale: Int = 0
    // 声明标题文本变量
    private var mTitle: String = ""
    // 声明文本颜色变量，默认为黑色
    private var mTextColor: Int = Color.BLACK
    // 声明文本大小变量
    private var mTextSize: Int = 0
    // 声明View宽度变量
    private var mWidth=0
    // 声明View高度变量
    private var mHeight=0
    // 声明矩形对象，用于定义绘制区域
    private val rect = Rect()
    // 声明画笔对象，用于绘制图形
    private val mPaint = Paint()
    // 声明文本边界矩形，用于计算文本尺寸
    private val mTextBound = Rect()

    // 初始化代码块
    init {
        // 获取主题中的样式属性
        val a = context.theme.obtainStyledAttributes(
            attrs, // 属性集
            R.styleable.MyView, // 自定义属性数组
            defStyleAttr, // 默认样式
            0 // 默认值
        )

        // 遍历所有属性
        for (i in 0 until a.indexCount) {
            // 根据属性类型进行不同处理
            when (val attr = a.getIndex(i)) {
                // 处理图片属性
                R.styleable.MyView_image -> {
                    // 获取资源ID
                    val resId = a.getResourceId(attr, 0)
                    // 如果资源ID有效，则解码位图
                    if (resId != 0) {
                        mImage = BitmapFactory.decodeResource(resources, resId)
                    }
                }
                // 处理图片缩放类型属性
                R.styleable.MyView_imageScaleType -> {
                    mImageScale = a.getInt(attr, 0)
                }
                // 处理标题文本属性
                R.styleable.MyView_titleText -> {
                    mTitle = a.getString(attr) ?: ""
                }
                // 处理标题文本颜色属性
                R.styleable.MyView_titleTextColor -> {
                    mTextColor = a.getColor(attr, Color.BLACK)
                }
                // 处理标题文本大小属性
                R.styleable.MyView_titleTextSize -> {
                    mTextSize = a.getDimensionPixelSize(
                        attr, // 属性索引
                        // 默认值：16sp转换为像素
                        TypedValue.applyDimension(
                            TypedValue.COMPLEX_UNIT_SP, // 单位类型：sp
                            16f, // 默认大小：16
                            resources.displayMetrics // 显示指标
                        ).toInt() // 转换为整数
                    )
                }
            }
        }

        // 回收属性对象，释放资源
        a.recycle()

        // 设置画笔的文本大小
        mPaint.textSize = mTextSize.toFloat()
        // 计算文本边界，获取文本的宽高信息
        mPaint.getTextBounds(mTitle, 0, mTitle.length, mTextBound)
    }
}
```

- **重写onMeasure方法**

```kotlin
// 重写测量方法，计算View的尺寸
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        // 处理宽度测量
        var specMode = MeasureSpec.getMode(widthMeasureSpec) // 获取宽度测量模式
        var specSize = MeasureSpec.getSize(widthMeasureSpec) // 获取宽度测量大小

        // 根据测量模式计算宽度
        mWidth = when (specMode) {
            // 精确模式：直接使用指定的大小
            MeasureSpec.EXACTLY -> {
                Log.e("xxx", "EXACTLY") // 输出日志
                specSize
            }
            // 最大模式：不能超过指定大小
            MeasureSpec.AT_MOST -> {
                // 根据图片计算期望宽度
                val desireByImg = paddingLeft + paddingRight + (mImage?.width ?: 0)
                // 根据文本计算期望宽度
                val desireByTitle = paddingLeft + paddingRight + mTextBound.width()
                // 取两者中的最大值
                val desire = maxOf(desireByImg, desireByTitle)
                Log.e("xxx", "AT_MOST") // 输出日志
                // 返回期望值和指定值中的较小值
                minOf(desire, specSize)
            }
            // 未指定模式：使用期望的大小
            else -> { // MeasureSpec.UNSPECIFIED
                // 根据图片计算期望宽度
                val desireByImg = paddingLeft + paddingRight + (mImage?.width ?: 0)
                // 根据文本计算期望宽度
                val desireByTitle = paddingLeft + paddingRight + mTextBound.width()
                // 返回两者中的最大值
                maxOf(desireByImg, desireByTitle)
            }
        }

        // 处理高度测量
        specMode = MeasureSpec.getMode(heightMeasureSpec) // 获取高度测量模式
        specSize = MeasureSpec.getSize(heightMeasureSpec) // 获取高度测量大小

        // 根据测量模式计算高度
        mHeight = when (specMode) {
            // 精确模式：直接使用指定的大小
            MeasureSpec.EXACTLY -> specSize
            // 最大模式：不能超过指定大小
            MeasureSpec.AT_MOST -> {
                // 计算期望高度：内边距 + 图片高度 + 文本高度
                val desire = paddingTop + paddingBottom + (mImage?.height ?: 0) + mTextBound.height()
                // 返回期望值和指定值中的较小值
                minOf(desire, specSize)
            }
            // 未指定模式：使用期望的大小
            else -> {
                // 计算期望高度：内边距 + 图片高度 + 文本高度
                paddingTop + paddingBottom + (mImage?.height ?: 0) + mTextBound.height()
            }
        }

        // 设置测量结果，告诉父View我们的尺寸
        setMeasuredDimension(mWidth, mHeight)
    }
```

- **重写onDraw方法**

```kotlin
// 重写绘制方法，在画布上绘制内容
    override fun onDraw(canvas: Canvas) {
        // 绘制边框
        mPaint.strokeWidth = 4f // 设置边框宽度为4像素
        mPaint.style = Paint.Style.STROKE // 设置画笔样式为描边
        mPaint.color = Color.CYAN // 设置边框颜色为青色
        // 绘制矩形边框，覆盖整个View区域
        canvas.drawRect(0f, 0f, measuredWidth.toFloat(), measuredHeight.toFloat(), mPaint)

        // 初始化绘图区域，考虑内边距
        rect.left = paddingLeft // 左边界
        rect.right = mWidth - paddingRight // 右边界
        rect.top = paddingTop // 上边界
        rect.bottom = mHeight - paddingBottom // 下边界

        // 设置文字画笔样式
        mPaint.color = mTextColor // 设置文本颜色
        mPaint.style = Paint.Style.FILL // 设置画笔样式为填充

        // 判断文字是否需要省略显示
        val displayText = if (mTextBound.width() > mWidth) {
            // 如果文本宽度超过View宽度，需要省略
            val textPaint = TextPaint(mPaint) // 创建文本画笔
            // 使用省略号处理文本
            TextUtils.ellipsize(
                mTitle, // 原始文本
                textPaint, // 文本画笔
                (mWidth - paddingLeft - paddingRight).toFloat(), // 可用宽度
                TextUtils.TruncateAt.END // 在末尾添加省略号
            ).toString()
        } else {
            // 如果文本宽度不超过View宽度，直接使用原文本
            mTitle
        }

        // 计算文字位置并绘制
        val textX = if (displayText == mTitle) {
            // 如果是原文本，居中显示
            mWidth / 2f - mTextBound.width() / 2f
        } else {
            // 如果是省略文本，左对齐显示
            paddingLeft.toFloat()
        }
        val textY = (mHeight - paddingBottom).toFloat() // 文本Y坐标，考虑下内边距
        canvas.drawText(displayText, textX, textY, mPaint) // 绘制文本

        // 图片绘制区域去掉文字高度部分
        rect.bottom -= mTextBound.height() // 减去文本高度，为图片留出空间

        // 绘制图片
        mImage?.let { bitmap ->
            if (mImageScale == 0) {
                // 缩放模式：图片填充整个可用区域
                canvas.drawBitmap(bitmap, null, rect, mPaint)
            } else {
                // 居中模式：图片居中显示，保持原始大小
                // 计算图片的居中绘制区域
                rect.left = mWidth / 2 - bitmap.width / 2 // 左边界居中
                rect.right = mWidth / 2 + bitmap.width / 2 // 右边界居中
                rect.top = (mHeight - mTextBound.height()) / 2 - bitmap.height / 2 // 上边界居中
                rect.bottom = (mHeight - mTextBound.height()) / 2 + bitmap.height / 2 // 下边界居中
                canvas.drawBitmap(bitmap, null, rect, mPaint) // 绘制位图
            }
        }
    }
```

- **引入布局**

```kotlin
<LinearLayout  xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:example="http://schemas.android.com/apk/res-auto"
    android:layout_height="match_parent"
    android:layout_width="match_parent"
    android:orientation="vertical"
    tools:ignore="ResAuto">
    <com.example.viewtest.MyView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_margin="10dp"
        android:padding="10dp"
        example:image="@drawable/custom_img"
        example:imageScaleType="center"
        example:titleText="hello andorid ! "
        example:titleTextColor="#ff0000"
        example:titleTextSize="30sp" />

    <com.example.viewtest.MyView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_margin="10dp"
        android:padding="10dp"
        example:image="@drawable/vol_01"
        example:imageScaleType="center"
        example:titleText="helloworld"
        example:titleTextColor="#00ff00"
        example:titleTextSize="20sp" />

    <com.example.viewtest.MyView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_margin="10dp"
        android:padding="10dp"
        example:image="@drawable/vol_02"
        example:imageScaleType="fillXY"
        example:titleText="妹子~"
        example:titleTextColor="#ff0000"
        example:titleTextSize="12sp" />
</LinearLayout>
```

------

