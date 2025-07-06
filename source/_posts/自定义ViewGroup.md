---
title: 自定义ViewGroup
date: 2025-07-06 18:20:25
categories:
- 自定义View
tags:
---

### 作用

类似于自定义布局

### 职责

ViewGroup相当于一个放置View的容器，并且我们在写布局xml的时候，会告诉容器（凡是以layout为开头的属性，都是为用于告诉容器的），我们的宽度（layout_width）、高度（layout_height）、对齐方式（layout_gravity）等；当然还有margin等；于是乎，ViewGroup的职能为：给childView计算出建议的宽和高和测量模式 ；决定childView的位置；为什么只是建议的宽和高，而不是直接确定呢，别忘了childView宽和高可以设置为wrap_content，这样只有childView才能计算出自己的宽和高。

### 步骤

- **决定该ViewGroup的LayoutParams**
- **重写onMeasure方法**
- **重写onLayout方法**
- **使用该布局**

### 完整代码实例

```kotlin
class ViewLayout(context: Context, attrs: AttributeSet?):ViewGroup(context,attrs) {
    override fun generateLayoutParams(attrs: AttributeSet?): ViewGroup.LayoutParams {
        return MarginLayoutParams(context,attrs)
    }

    /**
     * 计算所有ChildView的宽度和高度 然后根据ChildView的计算结果，设置自己的宽和高
     */
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        /**
         * 获得此ViewGroup上级容器为其推荐的宽和高，以及计算模式
         */
        val widthMode = MeasureSpec.getMode(widthMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        val sizeWidth = MeasureSpec.getSize(widthMeasureSpec)
        val sizeHeight = MeasureSpec.getSize(heightMeasureSpec)


        // 计算出所有的childView的宽和高
        measureChildren(widthMeasureSpec, heightMeasureSpec)
        /**
         * 记录如果是wrap_content是设置的宽和高
         */
        var width = 0
        var height = 0

        val cCount = childCount

        var cWidth = 0
        var cHeight = 0
        var cParams: MarginLayoutParams? = null


        // 用于计算左边两个childView的高度
        var lHeight = 0
        // 用于计算右边两个childView的高度，最终高度取二者之间大值
        var rHeight = 0


        // 用于计算上边两个childView的宽度
        var tWidth = 0
        // 用于计算下面两个childiew的宽度，最终宽度取二者之间大值
        var bWidth = 0

        /**
         * 根据childView计算的出的宽和高，以及设置的margin计算容器的宽和高，主要用于容器是warp_content时
         */
        for (i in 0..<cCount) {
            val childView = getChildAt(i)
            cWidth = childView.measuredWidth
            cHeight = childView.measuredHeight
            cParams = childView.layoutParams as MarginLayoutParams


            // 上面两个childView
            if (i == 0 || i == 1) {
                tWidth += cWidth + cParams!!.leftMargin + cParams!!.rightMargin
            }

            if (i == 2 || i == 3) {
                bWidth += cWidth + cParams!!.leftMargin + cParams!!.rightMargin
            }

            if (i == 0 || i == 2) {
                lHeight += cHeight + cParams!!.topMargin + cParams!!.bottomMargin
            }

            if (i == 1 || i == 3) {
                rHeight += cHeight + cParams!!.topMargin + cParams!!.bottomMargin
            }
        }

        width = max(tWidth.toDouble(), bWidth.toDouble()).toInt()
        height = max(lHeight.toDouble(), rHeight.toDouble()).toInt()

        /**
         * 如果是wrap_content设置为我们计算的值
         * 否则：直接设置为父容器计算的值
         */
        setMeasuredDimension(
            if (widthMode == MeasureSpec.EXACTLY)
                sizeWidth
            else
                width, if (heightMode == MeasureSpec.EXACTLY)
                sizeHeight
            else
                height
        )
    }

    // abstract method in viewgroup
    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        val cCount = childCount
        var cWidth = 0
        var cHeight = 0
        var cParams: MarginLayoutParams? = null
        /**
         * 遍历所有childView根据其宽和高，以及margin进行布局
         */
        for (i in 0..<cCount) {
            val childView = getChildAt(i)
            cWidth = childView.measuredWidth
            cHeight = childView.measuredHeight
            cParams = childView.layoutParams as MarginLayoutParams

            var cl = 0
            var ct = 0
            var cr = 0
            var cb = 0

            when (i) {
                0 -> {
                    cl = cParams!!.leftMargin
                    ct = cParams!!.topMargin
                }

                1 -> {
                    cl = (width - cWidth - cParams!!.rightMargin)
                    ct = cParams!!.topMargin
                }

                2 -> {
                    cl = cParams!!.leftMargin
                    ct = height - cHeight - cParams!!.bottomMargin
                }

                3 -> {
                    cl = (width - cWidth - cParams!!.rightMargin)
                    ct = height - cHeight - cParams!!.bottomMargin
                }
            }
            cr = cl + cWidth
            cb = cHeight + ct
            childView.layout(cl, ct, cr, cb)
        }
    }

}
```

```kotlin
<com.example.studyviewgrope.ViewLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#AA333333" >

    <TextView
        android:layout_width="150dp"
        android:layout_height="150dp"
        android:background="#E5ED05"
        android:gravity="center"
        android:text="0"
        android:textColor="#FFFFFF"
        android:textSize="22sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:background="#00ff00"
        android:gravity="center"
        android:text="1"
        android:textColor="#FFFFFF"
        android:textSize="22sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:background="#ff0000"
        android:gravity="center"
        android:text="2"
        android:textColor="#FFFFFF"
        android:textSize="22sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="150dp"
        android:layout_height="150dp"
        android:background="#0000ff"
        android:gravity="center"
        android:text="3"
        android:textColor="#FFFFFF"
        android:textSize="22sp"
        android:textStyle="bold" />

</com.example.studyviewgrope.ViewLayout>
```

