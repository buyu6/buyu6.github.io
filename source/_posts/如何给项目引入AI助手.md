---
title: 如何给项目引入AI助手
date: 2025-08-20 11:34:36
categories:
- AI
tags:
---

#                                        这里拿Gemini进行示范

- ### 先根据返回的JSON数据格式写出数据模型

```kotlin
//AI的api调用请求体和响应体json格式不相同需要区别开来
data class GeminiRequestBody(val contents:List<Content>)
data class GeminiResponseBody(val candidates: List<Candidate>)
data class Candidate(val content: Content)
data class Content(val parts:List<Part>)
data class Part(val text:String)
```

- ### 定义接口，这里使用***POST***注解，***GET***注解只用于获取数据，这里不适用

```kotlin
interface AIService {
    @POST("v1beta/models/gemini-2.5-flash:generateContent")
     suspend fun generateContent(
        @Query("key") apiKey: String = MyApplication.GEMINI_API_KEY,
        @Body requestBody: GeminiRequestBody
    ) :Response<GeminiResponseBody>
}
```

- ### 搭建Retrofit构建器

```kotlin
object AICreator {
    private const val BASE_URL = "https://generativelanguage.googleapis.com/"
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        
    fun <T> create(serviceClass:Class<T>):T= retrofit.create(serviceClass)
    inline fun <reified T>create():T=create(T::class.java)
}
```

- ### 提交申请并对返回的数据进行解析

```kotlin
object AInetwork {
    //创建接口的动态代理对象
    private val aiService = AICreator.create<AIService>()
    //向AI服务器发送一个请求，并处理返回的结果。
    suspend fun generateContent(requestBody: GeminiRequestBody): Result<GeminiResponseBody> {
        return try {
            val response = aiService.generateContent(requestBody=requestBody)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                val errorMessage = response.errorBody()?.string() ?: "未知错误"
                Log.e("AInetwork", "数据获取失败: $errorMessage")
                Result.failure(RuntimeException("API请求失败: ${response.code()} - $errorMessage"))
            }
        } catch (e: Exception) {
            Log.e("AInetwork", "网络请求失败: ${e.message}", e)
            Result.failure(e)
        }
    }
}
```

- ### 进行调用

```kotlin
//界面逻辑
class AIActivity : AppCompatActivity() {
    private lateinit var binder: ActivityAiactivityBinding
    private lateinit var viewModel: AIViewModel
    private val  msgList=ArrayList<Msg>()
    private var adapter: MsgAdapter? = null
        override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binder = ActivityAiactivityBinding.inflate(layoutInflater)
        setContentView(binder.root)
        
        // 初始化ViewModel
        viewModel = ViewModelProvider(this)[AIViewModel::class.java]
        
        // 设置工具栏
        setSupportActionBar(binder.AiToolbar)
        supportActionBar?.let {
            it.title = ""
            it.setDisplayHomeAsUpEnabled(true)
            it.setHomeAsUpIndicator(R.drawable.ic_return)
        }
        
        // 设置RecyclerView
        binder.AiRecyclerView.layoutManager = LinearLayoutManager(this)
        adapter = MsgAdapter(msgList)
        binder.AiRecyclerView.adapter = adapter
        
        // 设置按钮点击事件
        binder.AiButton.setOnClickListener {
            send()
        }
        
        // 观察数据变化
        observeViewModel()
    }


    /**
     * 观察ViewModel数据变化
     */
    private fun observeViewModel() {
        // 观察消息列表变化
        viewModel.messages.observe(this) { messages ->
            adapter?.let { adapter ->
                // 更新适配器数据
                adapter.updateMessages(messages)
                // 滚动到最新消息
                if (messages.isNotEmpty()) {
                    binder.AiRecyclerView.scrollToPosition(messages.size - 1)
                }
            }
        }
        // 观察加载状态
        viewModel.isLoading.observe(this) { isLoading ->
            // 当AI正在思考时，禁用发送按钮
            binder.AiButton.isEnabled = !isLoading
        }
    }
    
    /**
     * 发送消息
     */
    private fun send() {
        val content = binder.AiEditText.text.toString()
        if (content.isNotEmpty()) {
            Log.d("AIActivity", "用户发送问题: $content")
            
            // 清空输入框
            binder.AiEditText.setText("")
            
            // 通过ViewModel发送消息
            viewModel.sendMessage(content)
        }
    }
    
}
```

```kotlin
//ViewModel部分
class AIViewModel : ViewModel() {

    // 消息列表
    private val _messages = MutableLiveData<List<Msg>>()
    val messages: LiveData<List<Msg>> = _messages

    // 加载状态
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    // 错误状态
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    // 内部消息列表
    private val messageList = mutableListOf<Msg>()

    init {
        _messages.value = messageList
        _isLoading.value = false
        _error.value = null
    }

    /**
     * 发送消息
     */
    fun sendMessage(content: String) {
        if (content.isBlank()) return

        // 添加用户消息
        addMessage(Msg(content, Msg.TYPE_SENT))

        // 请求AI回复
        requestAIResponse(content)
    }

    /**
     * 请求AI回复
     */
    private fun requestAIResponse(question: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                _error.value = null

                // 添加加载提示
                addMessage(Msg("正在思考中...", Msg.TYPE_RESERVED))

                // 在IO线程中执行网络请求
                val result = withContext(Dispatchers.IO) {
                    val requestBody = GeminiRequestBody(
                        contents = listOf(Content(parts = listOf(Part(text = question))))
                    )
                    AInetwork.generateContent(requestBody)
                }

                // 移除加载提示
                removeLastMessage()

                // 处理结果
                result.onSuccess { response ->
                    val aiResponse = response.candidates.firstOrNull()?.content?.parts?.firstOrNull()?.text

                    if (aiResponse.isNullOrEmpty()) {
                        addMessage(Msg("抱歉，我暂时无法回答您的问题。", Msg.TYPE_RESERVED))
                    } else {
                        addMessage(Msg(aiResponse, Msg.TYPE_RESERVED))
                    }
                }.onFailure { exception ->
                    val errorMsg = "网络请求失败: ${exception.message}"
                    addMessage(Msg(errorMsg, Msg.TYPE_RESERVED))
                    _error.value = errorMsg
                }

            } catch (e: Exception) {
                removeLastMessage()
                val errorMsg = "发生未知错误，请稍后重试。"
                addMessage(Msg(errorMsg, Msg.TYPE_RESERVED))
                _error.value = errorMsg
            } finally {
                _isLoading.value = false
            }
        }
    }

    /**
     * 添加消息到列表
     */
    private fun addMessage(message: Msg) {
        messageList.add(message)
        _messages.value = messageList.toList()
    }

    /**
     * 移除最后一条消息
     */
    private fun removeLastMessage() {
        if (messageList.isNotEmpty()) {
            messageList.removeAt(messageList.size - 1)
            _messages.value = messageList.toList()
        }
    }
}
```

