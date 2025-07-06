---
title: 自定义View(一)
date: 2025-07-04 17:08:12
categories:
- 自定义View
tags:
---

# 基本步骤

### 自定义View的属性

- **format取值类型：**

  | 格式类型    | 含义说明                                            |
  | ----------- | --------------------------------------------------- |
  | `reference` | 资源引用，例如 `@string/app_name`、`@drawable/icon` |
  | `string`    | 字符串文本，例如 `"Hello"`                          |
  | `integer`   | 整数，例如 `42`                                     |
  | `boolean`   | 布尔值，例如 `true`、`false`                        |
  | `color`     | 颜色值，例如 `#FF0000` 或 `@color/primary`          |
  | `dimension` | 尺寸值，例如 `16dp`、`12sp`                         |
  | `float`     | 浮点数，例如 `3.14`                                 |
  | `enum`      | 枚举值（需配合 `<enum>` 使用）                      |
  | `flag`      | 位标志（可多选，需配合 `<flag>` 使用）              |

```kotlin
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <attr name="titleText" format="string" />
    <attr name="titleTextColor" format="color" />
    <attr name="titleTextSize" format="dimension" />
    <declare-styleable name="MyView">
        <attr name="titleText" />
        <attr name="titleTextColor" />
        <attr name="titleTextSize" />
    </declare-styleable>
</resources>
```

### 在View的构造方法中获得我们自定义的属性

```kotlin
// 自定义 View，支持自定义属性
class MyView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0  // 支持 style 属性
) : View(context, attrs, defStyleAttr) {

    // 显示的文本
    private var mTitleText: String = ""

    // 文本颜色
    private var mTitleTextColor: Int = Color.BLACK

    // 文本大小（像素）
    private var mTitleTextSize: Int = 0

    // 用于记录文本的边界矩形
    //用于 存储当前文字的实际宽高，以便在 onMeasure() 和 onDraw() 中正确地布局和绘制文字。
    private val mBound: Rect = Rect()

    // 画笔对象,用于绘制文本、图形、颜色等
    private val mPaint: Paint = Paint()

    init {
        // 读取自定义属性
        attrs?.let {
            //从 XML 中获取自定义属性值（包括默认值、主题值）并赋给你的 View 成员变量
            val typedArray = context.theme.obtainStyledAttributes(
                it,
                R.styleable.MyView, // 需要在 attrs.xml 中声明
                defStyleAttr,
                0
            )

            try {
                // 获取 titleText 属性
                mTitleText = typedArray.getString(R.styleable.MyView_titleText) ?: ""

                // 获取 titleTextColor 属性，默认为黑色
                mTitleTextColor = typedArray.getColor(
                    R.styleable.MyView_titleTextColor,
                    Color.BLACK
                )

                // 获取 titleTextSize 属性，默认为 16sp
                mTitleTextSize = typedArray.getDimensionPixelSize(
                    R.styleable.MyView_titleTextSize,
                    TypedValue.applyDimension(
                        TypedValue.COMPLEX_UNIT_SP, 16f, resources.displayMetrics
                    ).toInt()
                )
            } finally {
                typedArray.recycle() // 回收 TypedArray，防止内存泄漏
            }
        }

        // 初始化画笔
        mPaint.textSize = mTitleTextSize.toFloat()
        mPaint.color = mTitleTextColor

        // 计算文本的边界
        /**
         * | 参数                  | 含义                         |
         * | ------------------- | -------------------------- |
         * | `mTitleText`        | 你要测量的文字内容                  |
         * | `0`                 | 起始字符索引                     |
         * | `mTitleText.length` | 结束字符索引（不包含）                |
         * | `mBound`            | 用来存储文字所占矩形区域的对象，类型是 `Rect` |
         *
         */
        mPaint.getTextBounds(mTitleText, 0, mTitleText.length, mBound)
    }
}
```



### [重写onMeasure()方法]（并非必要）

```kotlin
// 测量 View 的宽高
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val widthMode = MeasureSpec.getMode(widthMeasureSpec)
        val widthSize = MeasureSpec.getSize(widthMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        val heightSize = MeasureSpec.getSize(heightMeasureSpec)

        var width: Int
        var height: Int

        mPaint.textSize = mTitleTextSize.toFloat()
        if (mTitleText.isNotEmpty()) {
            mPaint.getTextBounds(mTitleText, 0, mTitleText.length, mBound)
        }

        val textWidth = mBound.width()
        val textHeight = mBound.height()

        // 根据测量模式决定最终宽度
        width = when (widthMode) {
            MeasureSpec.EXACTLY -> widthSize
            MeasureSpec.AT_MOST -> minOf(widthSize, paddingLeft + textWidth + paddingRight)
            MeasureSpec.UNSPECIFIED -> paddingLeft + textWidth + paddingRight
            else -> paddingLeft + textWidth + paddingRight
        }

        // 根据测量模式决定最终高度
        height = when (heightMode) {
            MeasureSpec.EXACTLY -> heightSize
            MeasureSpec.AT_MOST -> minOf(heightSize, paddingTop + textHeight + paddingBottom)
            MeasureSpec.UNSPECIFIED -> paddingTop + textHeight + paddingBottom
            else -> paddingTop + textHeight + paddingBottom
        }
    //提交尺寸
        setMeasuredDimension(width, height)
    }
```



### 重写onDraw()方法

```kotlin
 // 绘制内容
    override fun onDraw(canvas: Canvas) {
        // 绘制黄色背景
        mPaint.color = Color.YELLOW
        /**
         * | 参数       | 值                          | 含义                 |
         * | -------- | -------------------------- | ------------------ |
         * | `left`   | `0f`                       | 矩形左边缘坐标            |
         * | `top`    | `0f`                       | 矩形上边缘坐标            |
         * | `right`  | `measuredWidth.toFloat()`  | 矩形右边缘（整个 View 的宽度） |
         * | `bottom` | `measuredHeight.toFloat()` | 矩形下边缘（整个 View 的高度） |
         * | `mPaint` | 一个 `Paint` 对象              | 描述画笔颜色、样式、粗细等      |
         *
         */
        canvas.drawRect(0f, 0f, measuredWidth.toFloat(), measuredHeight.toFloat(), mPaint)

        // 绘制文本
        mPaint.color = mTitleTextColor
        /**
         * | 参数           | 含义                            |
         * | ------------ | ----------------------------- |
         * | `mTitleText` | 要绘制的文字内容                      |
         * | `x`          | 水平位置，**文字的起点 x 坐标**           |
         * | `y`          | 垂直位置，**文字的 baseline（基线）y 坐标** |
         * | `mPaint`     | 用于绘制的画笔，包括颜色、字体、大小等           |
         *
         */
        canvas.drawText(
            mTitleText,
            (width / 2 - mBound.width() / 2).toFloat(), // 水平居中
            (height / 2 + mBound.height() / 2).toFloat(), // 垂直居中
            mPaint
        )
    }
```

如果还需要点击事件，可以在init{}里面加上注册监听器语句

```kotlin
 this.setOnClickListener {
            //写出具体逻辑
            postInvalidate() // 重新绘制
        }
```

### 引入布局

```kotlin
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:custom="http://schemas.android.com/apk/res-auto"//必须自定义命名空间
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:ignore="ResAuto">
    <com.example.studyview.MyView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        custom:titleText="3712"
        android:padding="10dp"
        custom:titleTextColor="#ff0000"
        android:layout_centerInParent="true"
        custom:titleTextSize="40sp"
         />

</RelativeLayout>
```

------

