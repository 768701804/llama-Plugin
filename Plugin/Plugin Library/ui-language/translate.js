/* UI language —— llama.cpp Web UI 中文 / 日文词典 + DOM 翻译引擎
 * 只做「精确整串匹配」：一个文本节点必须完整等于词条才翻译，
 * 所以聊天内容、代码、文件名基本不会被误伤。
 * 右上角按钮在 中文 / 日本語 / English 之间切换；切回任一语言都从存下的英文原文重译。
 */
(function () {
  'use strict';

  var DICT = {
    /* ---------- 侧栏 / 导航 ---------- */
    'New chat': '新对话',
    'New Chat': '新对话',
    'Search': '搜索',
    'Models': '模型',
    'MCP': 'MCP',
    'Settings': '设置',
    'Recent conversations': '最近对话',
    'Recents': '最近',
    'Chat': '对话',
    'Chats': '对话',
    'Favorites': '收藏',
    'No chats yet': '还没有对话',
    'Conversation tabs': '对话标签页',
    'Close Sidebar': '收起侧栏',
    'Collapse navigation': '收起导航',
    'Expand navigation': '展开导航',
    'Conversation': '对话',
    'Pinned': '已置顶',
    'Today': '今天',
    'Yesterday': '昨天',

    /* ---------- 首页 ---------- */
    'Hello there': '你好呀',
    'Type a message or upload files to get started': '输入消息，或上传文件开始',
    'Type a message...': '输入消息…',
    'Type a message': '输入消息',
    'Record audio, type a message': '录音，或输入消息',
    'Send a message...': '发送消息…',
    'Start typing to see results': '开始输入以查看结果',
    'No results found': '没有找到结果',
    'Search files': '搜索文件',
    'Search in files': '在文件中搜索',

    /* ---------- 设置：分页 ---------- */
    'General': '常规',
    'Display': '显示',
    'Tools': '工具',
    'Agentic': '智能体',
    'Import/Export': '导入/导出',
    'Sampling & Penalties': '采样与惩罚',
    'Developer': '开发者',

    /* ---------- 设置：常规 ---------- */
    'Theme': '主题',
    'Choose the color theme for the interface. You can choose between System (follows your device settings), Light, or Dark.': '选择界面配色，可选「跟随系统」（随设备设置自动切换）、浅色或深色。',
    'System': '跟随系统',
    'Light': '浅色',
    'Dark': '深色',
    'API Key': 'API 密钥',
    'Set the API Key if you are using --api-key option for the server.': '如果服务端启动时用了 --api-key，在这里填入同样的密钥。',
    'System Message': '系统消息',
    'System message with actions': '带操作按钮的系统消息',
    'The starting message that defines how model should behave.': '用于规定模型行为方式的起始消息。',
    'Show system message in conversations': '在对话中显示系统消息',
    'Inject custom system message at the beginning of the conversation': '在对话开头注入自定义系统消息',
    'Paste long text to file length': '长文本转文件阈值',
    'On pasting long text, it will be converted to a file. You can control the file length by setting the value of this parameter. Value 0 means disable.': '粘贴超长文本时自动转成文件。这里控制触发长度，填 0 表示关闭。',
    'Send message on Enter': '回车发送消息',
    'Use Enter to send messages and Shift + Enter for new lines. When disabled, use Ctrl/Cmd + Enter.': '用 Enter 发送、Shift + Enter 换行；关闭后改用 Ctrl/Cmd + Enter 发送。',
    'Show microphone on empty input': '输入框为空时显示麦克风',
    'Automatically show microphone button instead of send button when textarea is empty for models with audio modality support.': '支持音频的模型在输入框为空时，自动把发送按钮换成麦克风按钮。',
    'Always show sidebar on desktop': '桌面端始终显示侧栏',
    'Always keep the sidebar visible on desktop instead of auto-hiding it.': '桌面端一直显示侧栏，不再自动隐藏。',
    'Disable automatic scroll': '关闭自动滚动',
    'Reset Settings to Default': '恢复默认设置',
    'Reset to Default': '恢复默认',
    'Save settings': '保存设置',
    'Save': '保存',
    'Cancel': '取消',
    'Confirm': '确定',
    'Close': '关闭',
    'Delete': '删除',
    'Enable': '启用',
    'Discard': '放弃',
    'Keep editing': '继续编辑',
    'Discard changes?': '放弃本次修改？',
    'Got it': '知道了',
    'Dismiss': '关闭提示',
    'Default': '默认',
    'Unknown': '未知',
    'Theme': '主题',

    /* ---------- 设置：显示 ---------- */
    'Show raw model names': '显示模型原始名称',
    'Display full raw model identifiers (e.g.': '显示完整的原始模型标识符（例如',
    'Display model tags': '显示模型标签',
    'Display model tags (e.g.': '显示模型标签（例如',
    'Show organization name in model selector': '在模型选择器中显示机构名',
    'Show model quantization information': '显示模型量化信息',
    'Show model modalities & capabilities in models selector': '在模型选择器中显示模态与能力',
    'Group models by family': '按系列分组模型',
    'Group models into families (e.g.': '把模型按系列分组（例如',
    'Render thinking as Markdown': '思考过程按 Markdown 渲染',
    'Render user content as Markdown': '用户内容按 Markdown 渲染',
    'Show thought in progress': '显示进行中的思考',
    'Show tool call in progress': '显示进行中的工具调用',
    'Always show tool call content': '始终显示工具调用内容',
    'Show message generation statistics': '显示消息生成统计',
    'Show statistics for individual agentic turns': '显示每轮智能体调用的统计',
    'Expand thought process by default when generating messages.': '生成消息时默认展开思考过程。',
    'Use full height code blocks': '代码块使用完整高度',
    'Copy text attachments as plain text': '文本附件以纯文本形式复制',
    'Expand System Message': '展开系统消息',
    'Collapse System Message': '收起系统消息',
    'Show system message': '显示系统消息',
    'Show full system message': '显示完整系统消息',
    'Edit system message...': '编辑系统消息…'
    ,

    /* ---------- 设置：采样与惩罚 ---------- */
    'Temperature': '温度',
    'Top K': 'Top-K 采样',
    'Top P': 'Top-P 采样',
    'Min P': 'Min-P 采样',
    'Typical P': 'Typical-P 采样',
    'Max tokens': '最大 token 数',
    'Repeat penalty': '重复惩罚',
    'Repeat last N': '重复惩罚窗口 N',
    'Presence penalty': '存在惩罚',
    'Frequency penalty': '频率惩罚',
    'Samplers': '采样器顺序',
    'Backend sampling': '后端采样',
    'Dynamic temperature range': '动态温度区间',
    'Dynamic temperature exponent': '动态温度指数',
    'DRY multiplier': 'DRY 倍率',
    'DRY base': 'DRY 基数',
    'DRY allowed length': 'DRY 允许长度',
    'DRY penalty last N': 'DRY 惩罚窗口 N',
    'XTC probability': 'XTC 概率',
    'XTC threshold': 'XTC 阈值',
    'The maximum number of token per output. Use -1 for infinite (no limit).': '每次输出的最大 token 数，-1 表示不限制。',
    'Keeps only k top tokens.': '只保留概率最高的 k 个 token。',
    'Limits tokens based on whether they appear in the output or not.': '根据 token 是否已出现过来施加惩罚。',
    'Limits tokens based on how often they appear in the output.': '根据 token 出现的频次来施加惩罚。',
    'Last n tokens to consider for penalizing repetition': '参与重复惩罚的最后 n 个 token',
    'Controls the repetition of token sequences in the generated text': '控制生成文本中词序列的重复程度',
    'The order at which samplers are applied, in simplified way. Default is': '采样器的应用顺序（简化写法），默认为',
    'Speculative decoding enabled': '已启用投机解码',

    /* ---------- 设置：智能体 / 工具 ---------- */
    'Agentic turns': '智能体轮数',
    'Agentic turns (LLM calls)': '智能体轮数（模型调用次数）',
    'Agentic summary': '智能体摘要',
    'Tool use': '工具调用',
    'Tool calls': '工具调用',
    'Tool calls executed': '已执行的工具调用',
    'Tool execution time': '工具执行耗时',
    'Tool execution rate': '工具执行速率',
    'Total time (LLM + tools)': '总耗时（模型 + 工具）',
    'Generate title with LLM': '用模型生成标题',
    'LLM title generation prompt': '标题生成提示词',
    'Use first non-empty line for the conversation title': '用首个非空行作为对话标题',
    'Compaction prompt': '对话压缩提示词',
    'Compaction preserved steps': '压缩时保留的步骤数',
    'Compacting conversation': '正在压缩对话',
    'Conversation compacted': '对话已压缩',
    'Generating summary': '正在生成摘要',
    'Summary': '摘要',
    'MCP servers': 'MCP 服务器',
    'Add New MCP Server': '新增 MCP 服务器',
    'Add another MCP server': '再添加一个 MCP 服务器',
    'MCP request timeout (seconds)': 'MCP 请求超时（秒）',
    'Timeout for individual MCP tool calls.': '单次 MCP 工具调用的超时时间。',
    'Authorization': '授权方式',
    'Content-Type': '内容类型',
    'Bearer': 'Bearer',
    'Use the Hugging Face Hub API': '使用 Hugging Face Hub 接口',
    'Enable Discover Models': '启用在线模型发现',
    'Hugging Face': 'Hugging Face',
    'Set working directory': '设置工作目录',
    'Set working directory to': '将工作目录设为',
    'Working directory cleared': '工作目录已清除',
    'Show full path in mentions': '提及中显示完整路径',
    'Mention search depth': '提及搜索深度',
    'Maximum image resolution (megapixels)': '图像最大分辨率（百万像素）',
    'Parse PDF as image': '将 PDF 按图片解析',
    'PDFs will be converted to text. Image-based PDFs may not work properly.': 'PDF 会被转成文本；扫描版 PDF 可能无法正常处理。',
    'Custom CSS': '自定义 CSS',
    'Custom JSON': '自定义 JSON',
    'Custom JSON parameters to send to the API. Must be valid JSON format.': '附加到 API 请求的自定义 JSON 参数，必须是合法 JSON。',
    'Enable raw output toggle': '启用原始输出开关',
    'Disable reasoning content parsing': '关闭推理内容解析',
    'Exclude reasoning from context': '从上下文中排除推理内容',
    'Pre-fill KV cache after response': '回复结束后预填充 KV 缓存',
    'Include all attachments': '包含全部附件',
    'Show build version information': '显示构建版本信息',
    'Runtime info': '运行时信息',
    'System message with actions': '带操作按钮的系统消息'
    ,

    /* ---------- 对话操作 ---------- */
    'Regenerate': '重新生成',
    'Copy': '复制',
    'Edit': '编辑',
    'Edit your message...': '编辑你的消息…',
    'Delete Message': '删除消息',
    'Fork': '分叉',
    'Fork Conversation': '分叉对话',
    'Fork conversation': '分叉对话',
    'Create a new conversation branching from this message.': '从这条消息分叉出一个新对话。',
    'Enter fork name': '输入分叉名称',
    'Continue': '继续',
    'Stop generation': '停止生成',
    'Send immediately': '立即发送',
    'Open in new tab': '在新标签页打开',
    'Pin': '置顶',
    'Unpin': '取消置顶',
    'Pin all': '全部置顶',
    'Unpin all': '全部取消置顶',
    'Export': '导出',
    'Select': '选择',
    'Select all': '全选',
    'Deselect all': '取消全选',
    'Delete selected': '删除所选',
    'Export selected': '导出所选',
    'Bulk actions for selected conversations': '所选对话的批量操作',
    'Exit bulk selection mode': '退出批量选择',
    'More actions': '更多操作',
    'Actions': '操作',
    'Delete Conversation': '删除对话',
    'Are you sure you want to delete this conversation? This action cannot be undone and will permanently remove all messages in this conversation.': '确定要删除这个对话吗？此操作无法撤销，将永久删除该对话中的所有消息。',
    'Export Without Sensitive Data': '导出（不含敏感数据）',
    'Export Anyway': '仍然导出',
    'Conversation title': '对话标题',
    'Choose a new title for this conversation.': '为这个对话起一个新标题。',
    'Title': '标题',
    'Rename': '重命名',
    'Unavailable for mixed state selection': '多选状态不一致，不可用',

    /* ---------- 模型 ---------- */
    'Local models': '本地模型',
    'Loaded models': '已加载模型',
    'Loaded': '已加载',
    'Not loaded': '未加载',
    'Loading': '加载中',
    'Loading draft': '加载草稿',
    'Loading projector': '加载投影器',
    'Loading weights': '加载权重',
    'Delete model': '删除模型',
    'Manage model': '管理模型',
    'Downloading': '下载中',
    'Paused': '已暂停',
    'Cancel download': '取消下载',
    'Cancel downloading': '取消下载中',
    'Pause downloading': '暂停下载',
    'Resume downloading': '继续下载',
    'Keep downloading': '继续下载',
    'Download content': '下载内容',
    'Hidden models': '已隐藏模型',
    'Unknown Model': '未知模型',
    'Other': '其他',
    'Next version': '下一版本',
    'Previous version': '上一版本',
    'Sleeping': '休眠中',
    'Processing': '处理中',
    'Preparing response...': '正在准备回复…',
    'Waiting for tokens...': '等待生成…',
    'Initializing...': '正在初始化…',
    'Generating...': '正在生成…',
    'Processing...': '处理中…',
    'Reading': '读取中',

    /* ---------- 附件 / 文件 ---------- */
    'Add files': '添加文件',
    'Add files, system prompt or pick the tools the model may call': '添加文件、系统提示，或选择模型可调用的工具',
    'Add files, prompts, tools or MCP Servers': '添加文件、提示词、工具或 MCP 服务器',
    'Add to chat': '添加到对话',
    'Files': '文件',
    'Images': '图片',
    'Audio': '音频',
    'Video': '视频',
    'Vision': '视觉',
    'PDFs': 'PDF',
    'Text Files': '文本文件',
    'Audio Files': '音频文件',
    'Video Files': '视频文件',
    'PDF Files': 'PDF 文件',
    'Pasted': '已粘贴',
    'File Upload Error': '文件上传失败',
    'Some files cannot be uploaded with the current model.': '当前模型无法上传部分文件。',
    'Not supported by current model': '当前模型不支持',
    'Audio files processing requires an audio model': '处理音频文件需要音频模型',
    'Image processing requires a vision model': '处理图片需要视觉模型',
    'Video files processing requires a video model': '处理视频需要视频模型',
    'Audio recording not supported': '不支持录音',
    'Read file': '读取文件',
    'Write file': '写入文件',
    'Edit file': '编辑文件',
    'Read media': '读取媒体',
    'Read Resource': '读取资源',
    'Run command': '执行命令',
    'Run JavaScript': '运行 JavaScript',
    'Binary content': '二进制内容',
    'Link': '链接',

    /* ---------- 统计 / 状态 ---------- */
    'Prompt tokens': '输入 token 数',
    'Generated tokens': '输出 token 数',
    'Total tokens generated': '累计输出 token',
    'Generation speed': '生成速度',
    'Prompt processing speed': '预填充速度',
    'Generation time': '生成耗时',
    'Prompt processing time': '预填充耗时',
    'Generation': '生成',
    'Reasoning': '推理',
    'Context': '上下文',
    'Context:': '上下文：',
    'Context window usage of the model the chat runs': '当前对话所使用模型的上下文占用',
    'Connected': '已连接',
    'Connecting...': '连接中…',
    'Disconnected': '已断开',
    'Connection Error': '连接错误',
    'Connection error - please try again': '连接出错，请重试',
    'Failed to connect to server': '无法连接到服务器',
    'Cannot connect to server - check if server is running': '连不上服务器，请确认服务已启动',
    'Server is not running or unreachable': '服务器未运行或无法访问',
    'Server not found - check server address': '找不到服务器，请检查地址',
    'Server temporarily unavailable': '服务器暂时不可用',
    'Server error - check server logs': '服务器错误，请查看日志',
    'Server Error': '服务器错误',
    'Request failed': '请求失败',
    'Request timed out': '请求超时',
    'Access denied': '访问被拒绝',
    'Access denied - check server permissions': '访问被拒绝，请检查服务端权限',
    'Invalid API key - please check and try again': 'API 密钥无效，请检查后重试',
    'Invalid URL format': 'URL 格式不正确',
    'URL is required': '必须填写 URL',
    'Failed to load': '加载失败',
    'Failed to export settings': '导出设置失败',
    'Failed to export settings:': '导出设置失败：',
    'Failed to import settings:': '导入设置失败：',
    'Settings exported': '设置已导出',
    'Settings imported successfully': '设置导入成功',
    'Invalid settings file: missing config': '设置文件无效：缺少 config',
    'Failed to start recording:': '开始录音失败：',
    'Failed to stop recording:': '停止录音失败：',
    'Low': '低',
    'Medium': '中',
    'High': '高',
    'Extra High': '极高',
    'Minimal': '极低',
    'Current time': '当前时间',
    'Low': '低'
  };


  /* ================= 补充词条 ================= */
  var EXTRA = {
    'No conversations yet': '还没有对话',
    'No chats yet': '还没有对话',
    'New conversation': '新对话',
    'Open command picker': '打开命令面板',
    'Open prompt picker': '打开提示词面板',
    'Open file mention picker': '打开文件提及面板',
    'Open settings': '打开设置',
    'Open sidebar': '打开侧栏',
    'Close settings': '关闭设置',
    'Toggle sidebar': '切换侧栏',
    'Send': '发送',
    'Send message': '发送消息',
    'Attach': '附件',
    'Attach file': '添加附件',
    'Upload': '上传',
    'Retry': '重试',
    'Try again': '重试',
    'Thinking': '思考中',
    'Thoughts': '思考过程',
    'Stop': '停止',
    'Edit message': '编辑消息',
    'Delete this message': '删除这条消息',
    'Copy message': '复制消息',
    'More': '更多',
    'Less': '收起',
    'Show more': '展开更多',
    'Show less': '收起',
    'Cancel generation': '取消生成',
    'New': '新建',
    'Rename conversation': '重命名对话',
    'Open': '打开',
    'Download': '下载',
    'Refresh': '刷新',
    'Reload': '重新加载',
    'Sign in': '登录',
    'Sign out': '退出登录',
    'Loading models': '正在加载模型',
    'No models found': '没有找到模型',
    'Search models': '搜索模型',
    'Model': '模型',
    'Context size': '上下文长度',
    'Advanced': '高级',
    'Basic': '基础',
    'Close dialog': '关闭对话框',
    'Dismiss notification': '关闭通知',
    'Export conversation': '导出对话',
    'Import conversation': '导入对话',
    'Clear': '清空',
    'Clear all': '全部清空',
    'Apply': '应用',
    'Reset': '重置',
    'OK': '确定',
    'Yes': '是',
    'No': '否'
  };
  for (var _k in EXTRA) if (!Object.prototype.hasOwnProperty.call(DICT, _k)) DICT[_k] = EXTRA[_k];


  /* ================= 设置项说明（第二批） ================= */
  var EXTRA2 = {
    'After each response, re-submit the conversation to pre-fill the server KV cache. Makes the next turn faster since the prompt is already encoded while you read the response.': '每次回复后，把对话重新提交一遍以预填充服务端 KV 缓存。这样下一轮提问时提示词已经算好，响应更快。',
    'Agentic turn limit reached. Continue?': '已达到智能体轮数上限，继续吗？',
    'Always display code blocks at their full natural height, overriding any height limits.': '代码块始终按完整高度显示，不受高度限制。',
    'Browse and attach resources from connected MCP servers to your chat context.': '浏览并附加已连接的 MCP 服务器上的资源到对话上下文。',
    'Configuration, actions and metadata of the selected model.': '所选模型的配置、操作和元数据。',
    'Configure MCP servers as a JSON list. Use the form in the MCP Client settings section to edit.': '以 JSON 列表配置 MCP 服务器。也可以在上方 MCP 客户端设置里用表单编辑。',
    'Connect a remote MCP server by URL.': '通过 URL 连接远程 MCP 服务器。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets DRY penalty for the last n tokens.': 'DRY 采样能在长上下文中抑制重复。此参数设置参与 DRY 惩罚的最后 n 个 token。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets the DRY sampling base value.': 'DRY 采样能在长上下文中抑制重复。此参数设置 DRY 采样的基数。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets the DRY sampling multiplier.': 'DRY 采样能在长上下文中抑制重复。此参数设置 DRY 采样的倍率。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets the allowed length for DRY sampling.': 'DRY 采样能在长上下文中抑制重复。此参数设置 DRY 采样允许的重复长度。',
    'Display generation statistics (tokens/second, token count, duration) below each assistant message.': '在每条助手回复下方显示生成统计（每秒 token 数、token 数、耗时）。',
    'Display model tags (e.g. "vision", "reasoning") next to model names throughout the interface.': '在整个界面中于模型名旁显示标签（如「vision」「reasoning」）。',
    'Display the current build version in the bottom-right corner of the interface.': '在界面右下角显示当前构建版本。',
    'Display the organization name alongside model names in the model selector, in the trigger and in the model rows.': '在模型选择器、入口按钮和模型列表中，于模型名旁显示机构名。',
    'Display the system message at the top of each conversation.': '在每条对话顶部显示系统消息。',
    'Enable "Continue" button for assistant messages, including reasoning models.': '为助手回复显示「继续」按钮（推理模型同样适用）。',
    'Enable backend-based samplers. When enabled, supported samplers run on the accelerator backend for faster sampling.': '启用后端采样。开启后受支持的采样器在加速器上运行，采样更快。',
    'Export conversations': '导出对话',
    'Download your conversations as a ZIP of JSONL files. This includes all messages, attachments, and conversation history.': '把对话导出成 JSONL 的 ZIP 包，包含全部消息、附件和对话历史。',
    'Export settings': '导出设置',
    'Export your chat settings and preferences as a JSON file.': '把聊天设置和偏好导出为 JSON 文件。',
    'Import conversations': '导入对话',
    'Import one or more conversations from a previously exported ZIP or JSONL file. This will merge with your existing conversations.': '从之前导出的 ZIP 或 JSONL 文件导入一个或多个对话，会与现有对话合并。',
    'Import settings': '导入设置',
    'Import chat settings from a previously exported JSON file. This will merge with your existing settings.': '从之前导出的 JSON 文件导入聊天设置，会与现有设置合并。',
    'Find models on Hugging Face and download them to the server.': '在 Hugging Face 上查找模型并下载到服务器。',
    'Group models into families (e.g. "Qwen") in the model picker and the models manager. Turn it off to list every model on its own.': '在模型选择器和模型管理里按系列（如「Qwen」）分组。关闭后逐个列出。',
    'Images larger than this will be resized before sending to server. Set to 0 to disable.': '超过此尺寸的图片会在发送前缩放。填 0 表示不限制。',
    'Invalid JSON in custom parameters. Please check the format and try again.': '自定义参数不是合法 JSON，请检查格式后重试。',
    'Keep tool call details expanded after completion. Takes precedence over "Show tool call in progress", which only covers the in-flight phases.': '工具调用完成后仍保持展开。优先级高于「显示进行中的工具调用」，后者只覆盖执行中的阶段。',
    'Limits tokens based on the minimum probability for a token to be considered, relative to the probability of the most likely token.': '根据 token 相对于最高概率 token 的最小概率阈值来筛选候选。',
    'Maximum number of tool execution cycles before stopping (prevents infinite loops).': '工具执行的最大轮数，防止死循环。',
    'No response received from server. Please try again.': '没有收到服务器响应，请重试。',
    'Please enter a server URL first.': '请先填写服务器地址。',
    'Render display math flush left.': '行间公式左对齐显示。',
    'Render display math in leqno style (left-justified tags).': '行间公式使用 leqno 样式（公式编号靠左）。',
    'Render the reasoning/thinking block content as formatted Markdown instead of plain text.': '把推理/思考块的内容按 Markdown 渲染，而不是纯文本。',
    'Sending response for canceled message failed.': '取消消息的响应发送失败。',
    'Show open chats as browser-style tabs above the conversation, one per open chat. When disabled, only one chat is shown at a time.': '在对话上方以浏览器标签页的形式显示已打开的对话，每个对话一个标签。关闭后一次只显示一个。',
    'Show the Discover Models sidebar action to browse and download HuggingFace GGUF models. Turns the Hugging Face Hub API on while it is enabled. Only available in router mode.': '在侧栏显示「发现模型」，用于浏览和下载 Hugging Face 上的 GGUF 模型（开启时会同时启用 Hub 接口）。仅路由模式下可用。',
    'Show the modality and capability icons (vision, audio, reasoning, tools) on the models selector rows.': '在模型选择器列表中显示模态与能力图标（视觉、音频、推理、工具）。',
    'Shown once the model is loaded.': '模型加载完成后显示。',
    'Sorts and limits tokens based on the difference between log-probability and entropy.': '根据对数概率与熵的差值来排序和筛选 token。',
    'Stop the view from following new content while messages stream, so you control the viewport position yourself.': '流式生成时视图不再自动跟随新内容，由你自己控制滚动位置。',
    'The requested model could not be found. Select an available model to continue.': '找不到请求的模型，请选择一个可用模型继续。',
    'This is a cross-origin browser request. If the server is reachable from curl or Node but not from the browser, missing CORS headers are the most likely cause.': '这是跨域浏览器请求。如果 curl 或 Node 能连上但浏览器不行，多半是缺少 CORS 响应头。',
    'When copying a message with text attachments, combine them into a single plain text string instead of a special format that can be pasted back as attachments.': '复制带文本附件的消息时，合并成一段纯文本，而不是可以还原成附件的特殊格式。',
    'XTC sampler cuts out top tokens; this parameter controls the chance of cutting tokens at all. 0 disables XTC.': 'XTC 采样器会剔除高概率 token；此参数控制是否执行剔除的概率，0 表示关闭。',
    'XTC sampler cuts out top tokens; this parameter controls the token probability that is required to cut that token.': 'XTC 采样器会剔除高概率 token；此参数控制剔除所需达到的概率阈值。',
    'No models yet.': '还没有模型',
    'No models found.': '没有找到模型',
    'Display the current build version in the bottom-right corner of the interface.': '在界面右下角显示当前构建版本。',
    'Agentic turn limit reached.': '已达智能体轮数上限。',
    'Enable "Continue" button': '启用「继续」按钮'
  };
  for (var _k2 in EXTRA2) if (!Object.prototype.hasOwnProperty.call(DICT, _k2)) DICT[_k2] = EXTRA2[_k2];


  /* ================= 第三批：设置页残留 ================= */
  var EXTRA3 = {
    'JavaScript sandbox tool': 'JavaScript 沙箱工具',
    'Last steps a compaction keeps as written after the summary: a user message, or an assistant message with its tool results.': '压缩后仍按原文保留的末尾步骤数：一条用户消息，或一条带工具结果的助手消息。',
    'Limits tokens to those that together have a cumulative probability of at least p': '只保留累计概率达到 p 的 token。',
    'Optional override for the instruction sent to the model when compacting a conversation.': '压缩对话时发给模型的指令，可在此自定义覆盖。',
    'Parse PDF as image instead of text. Automatically falls back to text processing for non-vision models.': '把 PDF 按图片解析而不是文本。对不支持视觉的模型会自动退回文本处理。',
    'Permanently delete all conversations and their messages. This action cannot be undone. Consider exporting your conversations first if you want to keep a backup.': '永久删除所有对话及其消息。此操作无法撤销，想留备份请先导出对话。',
    'Reload app': '重新加载应用',
    'Render user messages using markdown formatting in the chat. Turn this off to keep a message exactly as typed; @-mention badges show either way.': '在对话中把用户消息按 Markdown 渲染。关闭后消息会原样显示；@ 提及的标记两种情况都会保留。',
    'Send reasoning_format=none so the server returns thinking tokens inline instead of extracting them into a separate field.': '发送 reasoning_format=none，让服务端把思考 token 直接内联返回，而不是拆到单独字段。',
    'Settings are saved in browser\'s localStorage': '设置保存在浏览器的 localStorage 中',
    'Show model tags': '显示模型标签',
    'Show toggle button to display messages as plain text instead of Markdown-formatted content': '显示切换按钮，把消息按纯文本而不是 Markdown 渲染',
    'Strip thinking from previous messages before sending. When off, thinking is sent back via the reasoning_content field so the model sees its own chain-of-thought across turns.': '发送前剥离历史消息里的思考内容。关闭后思考会通过 reasoning_content 字段回传，模型能看到自己前几轮的思考过程。',
    'The order at which samplers are applied, in simplified way. Default is "top_k;typ_p;top_p;min_p;temperature": top_k->typ_p->top_p->min_p->temperature': '采样器的应用顺序（简化写法）。默认 "top_k;typ_p;top_p;min_p;temperature"，执行顺序为 top_k→typ_p→top_p→min_p→temperature',
    'Tool': '工具',
    'Tools': '工具',
    'Top K': 'Top-K 采样',
    'Top P': 'Top-P 采样',
    'Min P': 'Min-P 采样',
    'Typical P': 'Typical-P 采样',
    'Reasoning effort': '推理强度',
    'Notifications alt+T': '通知 Alt+T',
    'Scroll left': '向左滚动',
    'Scroll right': '向右滚动',
    'Reload app to apply': '重新加载应用以生效',
    'Set the API Key if you are using': '如果服务端启动时用了',
    'option for the server.': '--api-key 参数，在这里填上同样的密钥。',
    'Show notification bell and desktop notifications for background events.': '在后台事件发生时显示通知铃铛和桌面通知。',
    'Enable chat notifications': '启用聊天通知',
    'Default value': '默认值'
  };
  for (var _k3 in EXTRA3) if (!Object.prototype.hasOwnProperty.call(DICT, _k3)) DICT[_k3] = EXTRA3[_k3];


  /* ================= 第四批：模型页 / MCP 页 / 提示 == */
  var EXTRA4 = {
    'Add New Server': '新增服务器',
    'Add your first MCP server': '添加第一个 MCP 服务器',
    'Always allow': '始终允许',
    'Any context': '任意上下文',
    'Browser': '浏览器',
    'Conversations': '对话',
    'Delete All': '全部删除',
    'Delete all conversations': '删除所有对话',
    'Enabled': '已启用',
    'Import': '导入',
    'MCP Servers': 'MCP 服务器',
    'Model actions': '模型操作',
    'Status': '状态',
    'Search your models': '搜索你的模型',
    'Served by this server': '由本服务器提供',
    'Sort by context, lowest first': '按上下文排序（从低到高）',
    'Sort by model, lowest first': '按模型排序（从低到高）',
    'Addon for the temperature sampler. Smoothes out the probability redistribution based on the most probable token.': '温度采样器的附加项：根据最高概率 token 平滑概率再分配。',
    'Addon for the temperature sampler. The added value to the range of dynamic temperature, which adjusts probabilities by entropy of tokens.': '温度采样器的附加项：动态温度区间的附加值，按 token 熵调整概率。',
    'Applies to new conversations. Tool picks inside a chat only affect that chat.': '仅对新对话生效；对话内的工具选择只影响该对话。',
    'CSS injected into the page at runtime. Set it here, or ship it server side via the --ui-config customCss field.': '运行时注入页面的 CSS。可以在这里设置，也可以由服务端通过 --ui-config 的 customCss 字段下发。',
    'Choose how conversation titles are generated. The first non-empty line uses a fast deterministic rule; the LLM option uses a model-generated title from the first message exchange.': '选择对话标题的生成方式：首个非空行——用快速的固定规则；LLM——由模型根据第一轮对话生成标题。',
    'Controls the randomness of the generated text by affecting the probability distribution of the output tokens. Higher = more random, lower = more focused.': '通过影响输出 token 的概率分布来控制生成的随机性。数值越高越随机，越低越聚焦。',
    'Display full raw model identifiers (e.g. "ggml-org/GLM-4.7-Flash-GGUF:Q8_0") instead of parsed names with badges.': '显示完整原始模型标识符（如 "ggml-org/GLM-4.7-Flash-GGUF:Q8_0"），而不是解析后的名称加标签。',
    'Display per-turn statistics (tokens, duration) under each turn in agentic responses. Shown only when "Show message generation statistics" is enabled.': '在智能体回复的每一轮下方显示统计（token 数、耗时）。仅在开启「显示消息生成统计」时生效。',
    'Display quantization badges (e.g. Q8_0, Q4_K_M) next to model names throughout the interface.': '在整个界面中于模型名旁显示量化标签（如 Q8_0、Q4_K_M）。',
    'Display the full file system path inside file and folder @-mention badges instead of just the file or folder name.': '在文件和文件夹的 @ 提及标签里显示完整路径，而不只是名称。',
    'Expand tool call details while the call is being generated and executed, and collapse them again once its result is in. Mirrors "Show thought in progress". Tool calls you expand or collapse by hand keep your choice.': '工具调用生成和执行期间自动展开详情，结果返回后再收起。与「显示进行中的思考」一致；你手动展开或收起的调用会保持你的选择。',
    'Expose a run_javascript tool to the model. Code runs in a Web Worker inside a sandboxed iframe with an opaque origin, isolated from the WebUI and its API, with a hard timeout.': '向模型暴露 run_javascript 工具。代码在沙箱 iframe 内的 Web Worker 中运行（不透明源），与 WebUI 及其 API 隔离，并有强制超时。',
    'How many directory levels below the working directory the @-mention file search descends. Larger values surface deeply nested files but take longer on large trees.': '@ 提及的文件搜索向下深入几层目录。数值越大越能找到深层文件，但大目录树会更慢。',
    'Load, configure and remove the models this server can run.': '加载、配置和移除本服务器可运行的模型。'
  };
  for (var _k4 in EXTRA4) if (!Object.prototype.hasOwnProperty.call(DICT, _k4)) DICT[_k4] = EXTRA4[_k4];


  /* ================= 第五批：设置 schema 全量补齐 ================= */
  var EXTRA5 = {
    '128K or more': '128K 以上',
    '256K or more': '256K 以上',
    '32K or more': '32K 以上',
    '8K or more': '8K 以上',
    '1M or more': '1M 以上',
    'Architecture': '架构',
    'Avg speed': '平均速度',
    'Build Info': '构建信息',
    'Context Size': '上下文长度',
    'Delete from disk': '从磁盘删除',
    'Draft quant': '草稿量化',
    'Draft repo': '草稿仓库',
    'Draft sidecars': '草稿附属文件',
    'Embedding Size': '嵌入维度',
    'Enable PDF as Images': '将 PDF 按图片处理',
    'File Path': '文件路径',
    'Generated': '已生成',
    'License': '许可证',
    'Max': '最大',
    'Model Size': '模型大小',
    'Model size': '模型大小',
    'Off': '关闭',
    'Parallel Slots': '并行槽位数',
    'Parameters': '参数量',
    'Prompt': '提示词',
    'Prompt tokens evaluated': '已处理的输入 token',
    'Quantization': '量化',
    'See in Discover': '在「发现」中查看',
    'Suggested models': '推荐模型',
    'Symbolic math (nerdamer)': '符号计算（nerdamer）',
    'Tokens generated': '已生成 token',
    'Vocabulary Size': '词表大小',

    'Counterpart of the conversation title radio; stored and synced without a dedicated UI field.': '与对话标题生成方式对应的另一半设置；会被保存和同步，但没有单独的界面开关。',
    'Fetch model display data (avatars, context length, chat template) and everything in the Discover Models view from the Hugging Face Hub API. Locked on while Discover Models is enabled; can be turned on alone for just the display data.': '从 Hugging Face Hub 接口获取模型展示数据（头像、上下文长度、对话模板）以及「发现模型」页面的全部内容。开启「发现模型」时此项会被锁定；也可以单独开启，只用来取展示数据。',
    'Optional template for the title generation prompt. Use {{USER}} for the user message and {{ASSISTANT}} for the assistant message.': '标题生成提示词的可选模板。用 {{USER}} 代表用户消息，用 {{ASSISTANT}} 代表助手消息。',

    'Add to favorites': '加入收藏',
    'Remove from favorites': '取消收藏',
    'Are you sure you want to delete all conversations? This action cannot be undone and will permanently remove all your conversations and messages.': '确定要删除所有对话吗？此操作无法撤销，将永久删除你所有的对话和消息。',
    'Choose working directory': '选择工作目录',
    'Reset working directory': '重置工作目录',
    'Enter your API key...': '输入 API 密钥…',
    'Paste token here': '在此粘贴令牌',
    'Failed to fetch models': '获取模型列表失败',
    'Failed to load model': '加载模型失败',
    'Failed to load models': '加载模型列表失败',
    'Failed to unload model': '卸载模型失败',
    'Failed to load PDF images': '加载 PDF 图片失败',
    'Insert an MCP prompt': '插入 MCP 提示词',
    'Keep model': '保留模型',
    'Load model': '加载模型',
    'Unload model': '卸载模型',
    'Retry loading model': '重试加载模型',
    'Select model': '选择模型',
    'Path to the media file': '媒体文件路径',
    'Refresh resources': '刷新资源',
    'Search conversations...': '搜索对话…',
    'Search models...': '搜索模型…',
    'Search resources...': '搜索资源…',
    'Search failed': '搜索失败',
    'Scroll to bottom': '滚动到底部',
    'Skip reasoning': '跳过推理',
    'Summarize the conversation to free up context': '摘要这段对话以腾出上下文',
    'Unknown error': '未知错误',
    'Unknown error occurred': '发生未知错误',
    'Unknown error executing prompt': '执行提示词时发生未知错误',
    'Unknown reason': '未知原因',
    'You have unsaved changes. Are you sure you want to discard them?': '有未保存的修改，确定要放弃吗？',
    'Determines the markup language of the output.': '决定输出的标记语言。',
    'Invalid Base64 string': '无效的 Base64 字符串',
    'JavaScript source to execute': '要执行的 JavaScript 源码',
    'Search and browse AI models, datasets, spaces, and docs on the Hugging Face Hub.': '在 Hugging Face Hub 上搜索并浏览模型、数据集、Space 和文档。',
    'Search repositories, issues, pull requests and interact with code on GitHub.': '在 GitHub 上搜索仓库、议题、拉取请求，并与代码交互。',
    'Search the web and fetch full page content as clean markdown.': '搜索网页，并把整页内容抓成干净的 Markdown。',
    'Returns the current local date and time in ISO 8601 format, with the IANA time zone name': '返回当前本地日期时间（ISO 8601 格式），附带 IANA 时区名'
  };
  for (var _k5 in EXTRA5) if (!Object.prototype.hasOwnProperty.call(DICT, _k5)) DICT[_k5] = EXTRA5[_k5];

  /* ================= 日本語辞書（英文キー → 日本語） ================= */
  /* 键与 DICT 完全一致（555 条）；日文缺词直接回落英文，不会串到中文。 */
  var DICT_JA = {
    'New chat': '新しいチャット',
    'New Chat': '新しいチャット',
    'Search': '検索',
    'Models': 'モデル',
    'MCP': 'MCP',
    'Settings': '設定',
    'Recent conversations': '最近の会話',
    'Recents': '最近',
    'Chat': 'チャット',
    'Chats': 'チャット',
    'Favorites': 'お気に入り',
    'No chats yet': 'まだチャットがありません',
    'Conversation tabs': '会話タブ',
    'Close Sidebar': 'サイドバーを閉じる',
    'Collapse navigation': 'ナビゲーションを折りたたむ',
    'Expand navigation': 'ナビゲーションを展開',
    'Conversation': '会話',
    'Pinned': 'ピン留め',
    'Today': '今日',
    'Yesterday': '昨日',
    'Hello there': 'こんにちは',
    'Type a message or upload files to get started': 'メッセージを入力するか、ファイルをアップロードして始めましょう',
    'Type a message...': 'メッセージを入力…',
    'Type a message': 'メッセージを入力',
    'Record audio, type a message': '音声を録音、またはメッセージを入力',
    'Send a message...': 'メッセージを送信…',
    'Start typing to see results': '入力すると結果が表示されます',
    'No results found': '結果が見つかりません',
    'Search files': 'ファイルを検索',
    'Search in files': 'ファイル内を検索',
    'General': '一般',
    'Display': '表示',
    'Tools': 'ツール',
    'Agentic': 'エージェント',
    'Import/Export': 'インポート/エクスポート',
    'Sampling & Penalties': 'サンプリングとペナルティ',
    'Developer': '開発者',
    'Theme': 'テーマ',
    'Choose the color theme for the interface. You can choose between System (follows your device settings), Light, or Dark.': 'インターフェースの配色を選びます。「システム」（デバイス設定に従う）、ライト、ダークから選べます。',
    'System': 'システム',
    'Light': 'ライト',
    'Dark': 'ダーク',
    'API Key': 'API キー',
    'Set the API Key if you are using --api-key option for the server.': 'サーバー起動時に --api-key オプションを使っている場合は、同じキーをここに入力してください。',
    'System Message': 'システムメッセージ',
    'System message with actions': '操作ボタン付きのシステムメッセージ',
    'The starting message that defines how model should behave.': 'モデルの振る舞いを定義する開始メッセージです。',
    'Show system message in conversations': '会話内にシステムメッセージを表示',
    'Inject custom system message at the beginning of the conversation': '会話の冒頭にカスタムシステムメッセージを挿入',
    'Paste long text to file length': '長文をファイル化するしきい値',
    'On pasting long text, it will be converted to a file. You can control the file length by setting the value of this parameter. Value 0 means disable.': '長文を貼り付けるとファイルに変換されます。この値でファイル化する長さを制御できます。0 で無効になります。',
    'Send message on Enter': 'Enter でメッセージを送信',
    'Use Enter to send messages and Shift + Enter for new lines. When disabled, use Ctrl/Cmd + Enter.': 'Enter で送信、Shift + Enter で改行します。オフにすると Ctrl/Cmd + Enter で送信します。',
    'Show microphone on empty input': '入力が空のときマイクを表示',
    'Automatically show microphone button instead of send button when textarea is empty for models with audio modality support.': '音声対応モデルでは、入力欄が空のとき送信ボタンの代わりにマイクボタンを表示します。',
    'Always show sidebar on desktop': 'デスクトップで常にサイドバーを表示',
    'Always keep the sidebar visible on desktop instead of auto-hiding it.': 'デスクトップではサイドバーを自動で隠さず、常に表示します。',
    'Disable automatic scroll': '自動スクロールを無効化',
    'Reset Settings to Default': '設定を初期値に戻す',
    'Reset to Default': '初期値に戻す',
    'Save settings': '設定を保存',
    'Save': '保存',
    'Cancel': 'キャンセル',
    'Confirm': '確定',
    'Close': '閉じる',
    'Delete': '削除',
    'Enable': '有効化',
    'Discard': '破棄',
    'Keep editing': '編集を続ける',
    'Discard changes?': '変更を破棄しますか？',
    'Got it': '了解',
    'Dismiss': '閉じる',
    'Default': 'デフォルト',
    'Unknown': '不明',
    'Show raw model names': 'モデルの生の名前を表示',
    'Display full raw model identifiers (e.g.': '生のモデル識別子を完全表示（例',
    'Display model tags': 'モデルタグを表示',
    'Display model tags (e.g.': 'モデルタグを表示（例',
    'Show organization name in model selector': 'モデル選択に組織名を表示',
    'Show model quantization information': 'モデルの量子化情報を表示',
    'Show model modalities & capabilities in models selector': 'モデル選択にモダリティと機能を表示',
    'Group models by family': 'モデルをファミリーでグループ化',
    'Group models into families (e.g.': 'モデルをファミリーごとにグループ化（例',
    'Render thinking as Markdown': '思考を Markdown でレンダリング',
    'Render user content as Markdown': 'ユーザー内容を Markdown でレンダリング',
    'Show thought in progress': '進行中の思考を表示',
    'Show tool call in progress': '進行中のツール呼び出しを表示',
    'Always show tool call content': 'ツール呼び出しの内容を常に表示',
    'Show message generation statistics': 'メッセージ生成の統計を表示',
    'Show statistics for individual agentic turns': '各エージェントターンの統計を表示',
    'Expand thought process by default when generating messages.': 'メッセージ生成時に思考プロセスをデフォルトで展開します。',
    'Use full height code blocks': 'コードブロックを全高で表示',
    'Copy text attachments as plain text': 'テキスト添付をプレーンテキストとしてコピー',
    'Expand System Message': 'システムメッセージを展開',
    'Collapse System Message': 'システムメッセージを折りたたむ',
    'Show system message': 'システムメッセージを表示',
    'Show full system message': 'システムメッセージ全体を表示',
    'Edit system message...': 'システムメッセージを編集…',
    'Temperature': '温度',
    'Top K': 'Top-K',
    'Top P': 'Top-P',
    'Min P': 'Min-P',
    'Typical P': 'Typical-P',
    'Max tokens': '最大トークン数',
    'Repeat penalty': '繰り返しペナルティ',
    'Repeat last N': '繰り返し対象の直近 N',
    'Presence penalty': '存在ペナルティ',
    'Frequency penalty': '頻度ペナルティ',
    'Samplers': 'サンプラー',
    'Backend sampling': 'バックエンドサンプリング',
    'Dynamic temperature range': '動的温度レンジ',
    'Dynamic temperature exponent': '動的温度の指数',
    'DRY multiplier': 'DRY 倍率',
    'DRY base': 'DRY 基数',
    'DRY allowed length': 'DRY 許容長',
    'DRY penalty last N': 'DRY ペナルティ対象の直近 N',
    'XTC probability': 'XTC 確率',
    'XTC threshold': 'XTC しきい値',
    'The maximum number of token per output. Use -1 for infinite (no limit).': '出力あたりの最大トークン数。-1 で無制限。',
    'Keeps only k top tokens.': '確率上位 k 個のトークンのみを残します。',
    'Limits tokens based on whether they appear in the output or not.': 'トークンが出力に現れたかどうかでペナルティを課します。',
    'Limits tokens based on how often they appear in the output.': 'トークンの出現頻度に応じてペナルティを課します。',
    'Last n tokens to consider for penalizing repetition': '繰り返しペナルティの対象とする直近 n トークン',
    'Controls the repetition of token sequences in the generated text': '生成テキスト内のトークン列の繰り返しを制御します',
    'The order at which samplers are applied, in simplified way. Default is': 'サンプラーの適用順（簡易表記）。デフォルトは',
    'Speculative decoding enabled': '投機的デコーディング有効',
    'Agentic turns': 'エージェントターン数',
    'Agentic turns (LLM calls)': 'エージェントターン数（モデル呼び出し）',
    'Agentic summary': 'エージェント要約',
    'Tool use': 'ツール使用',
    'Tool calls': 'ツール呼び出し',
    'Tool calls executed': '実行済みのツール呼び出し',
    'Tool execution time': 'ツール実行時間',
    'Tool execution rate': 'ツール実行レート',
    'Total time (LLM + tools)': '合計時間（モデル + ツール）',
    'Generate title with LLM': 'モデルでタイトルを生成',
    'LLM title generation prompt': 'タイトル生成プロンプト',
    'Use first non-empty line for the conversation title': '最初の空でない行を会話タイトルに使う',
    'Compaction prompt': '圧縮プロンプト',
    'Compaction preserved steps': '圧縮時に保持するステップ数',
    'Compacting conversation': '会話を圧縮中',
    'Conversation compacted': '会話を圧縮しました',
    'Generating summary': '要約を生成中',
    'Summary': '要約',
    'MCP servers': 'MCP サーバー',
    'Add New MCP Server': 'MCP サーバーを追加',
    'Add another MCP server': 'もう一つ MCP サーバーを追加',
    'MCP request timeout (seconds)': 'MCP リクエストのタイムアウト（秒）',
    'Timeout for individual MCP tool calls.': 'MCP ツール呼び出し 1 回あたりのタイムアウトです。',
    'Authorization': '認証',
    'Content-Type': 'Content-Type',
    'Bearer': 'Bearer',
    'Use the Hugging Face Hub API': 'Hugging Face Hub API を使う',
    'Enable Discover Models': 'モデル検索を有効化',
    'Hugging Face': 'Hugging Face',
    'Set working directory': '作業ディレクトリを設定',
    'Set working directory to': '作業ディレクトリを次に設定',
    'Working directory cleared': '作業ディレクトリをクリアしました',
    'Show full path in mentions': 'メンションに完全パスを表示',
    'Mention search depth': 'メンション検索の深さ',
    'Maximum image resolution (megapixels)': '画像の最大解像度（メガピクセル）',
    'Parse PDF as image': 'PDF を画像として解析',
    'PDFs will be converted to text. Image-based PDFs may not work properly.': 'PDF はテキストに変換されます。画像ベースの PDF は正常に処理されない場合があります。',
    'Custom CSS': 'カスタム CSS',
    'Custom JSON': 'カスタム JSON',
    'Custom JSON parameters to send to the API. Must be valid JSON format.': 'API に送るカスタム JSON パラメータ。有効な JSON である必要があります。',
    'Enable raw output toggle': '生出力の切替ボタンを有効化',
    'Disable reasoning content parsing': '推論内容の解析を無効化',
    'Exclude reasoning from context': '推論をコンテキストから除外',
    'Pre-fill KV cache after response': '応答後に KV キャッシュを事前充填',
    'Include all attachments': 'すべての添付を含める',
    'Show build version information': 'ビルドバージョン情報を表示',
    'Runtime info': 'ランタイム情報',
    'Regenerate': '再生成',
    'Copy': 'コピー',
    'Edit': '編集',
    'Edit your message...': 'メッセージを編集…',
    'Delete Message': 'メッセージを削除',
    'Fork': '分岐',
    'Fork Conversation': '会話を分岐',
    'Fork conversation': '会話を分岐',
    'Create a new conversation branching from this message.': 'このメッセージから新しい会話を分岐して作成します。',
    'Enter fork name': '分岐名を入力',
    'Continue': '続ける',
    'Stop generation': '生成を停止',
    'Send immediately': 'すぐに送信',
    'Open in new tab': '新しいタブで開く',
    'Pin': 'ピン留め',
    'Unpin': 'ピン留めを解除',
    'Pin all': 'すべてピン留め',
    'Unpin all': 'すべてのピン留めを解除',
    'Export': 'エクスポート',
    'Select': '選択',
    'Select all': 'すべて選択',
    'Deselect all': 'すべて選択解除',
    'Delete selected': '選択項目を削除',
    'Export selected': '選択項目をエクスポート',
    'Bulk actions for selected conversations': '選択した会話の一括操作',
    'Exit bulk selection mode': '一括選択モードを終了',
    'More actions': 'その他の操作',
    'Actions': '操作',
    'Delete Conversation': '会話を削除',
    'Are you sure you want to delete this conversation? This action cannot be undone and will permanently remove all messages in this conversation.': 'この会話を削除しますか？この操作は元に戻せず、会話内のすべてのメッセージが完全に削除されます。',
    'Export Without Sensitive Data': 'エクスポート（機密データなし）',
    'Export Anyway': 'そのままエクスポート',
    'Conversation title': '会話タイトル',
    'Choose a new title for this conversation.': 'この会話の新しいタイトルを入力してください。',
    'Title': 'タイトル',
    'Rename': '名前を変更',
    'Unavailable for mixed state selection': '混在選択のため使用できません',
    'Local models': 'ローカルモデル',
    'Loaded models': '読み込み済みモデル',
    'Loaded': '読み込み済み',
    'Not loaded': '未読み込み',
    'Loading': '読み込み中',
    'Loading draft': 'ドラフトを読み込み中',
    'Loading projector': 'プロジェクタを読み込み中',
    'Loading weights': '重みを読み込み中',
    'Delete model': 'モデルを削除',
    'Manage model': 'モデルを管理',
    'Downloading': 'ダウンロード中',
    'Paused': '一時停止中',
    'Cancel download': 'ダウンロードを中止',
    'Cancel downloading': 'ダウンロードを中止中',
    'Pause downloading': 'ダウンロードを一時停止',
    'Resume downloading': 'ダウンロードを再開',
    'Keep downloading': 'ダウンロードを続ける',
    'Download content': '内容をダウンロード',
    'Hidden models': '非表示のモデル',
    'Unknown Model': '不明なモデル',
    'Other': 'その他',
    'Next version': '次のバージョン',
    'Previous version': '前のバージョン',
    'Sleeping': 'スリープ中',
    'Processing': '処理中',
    'Preparing response...': '応答を準備中…',
    'Waiting for tokens...': 'トークン待ち…',
    'Initializing...': '初期化中…',
    'Generating...': '生成中…',
    'Processing...': '処理中…',
    'Reading': '読み取り中',
    'Add files': 'ファイルを追加',
    'Add files, system prompt or pick the tools the model may call': 'ファイル、システムプロンプトを追加、またはモデルが呼べるツールを選択',
    'Add files, prompts, tools or MCP Servers': 'ファイル、プロンプト、ツール、MCP サーバーを追加',
    'Add to chat': 'チャットに追加',
    'Files': 'ファイル',
    'Images': '画像',
    'Audio': '音声',
    'Video': '動画',
    'Vision': '視覚',
    'PDFs': 'PDF',
    'Text Files': 'テキストファイル',
    'Audio Files': '音声ファイル',
    'Video Files': '動画ファイル',
    'PDF Files': 'PDF ファイル',
    'Pasted': '貼り付け済み',
    'File Upload Error': 'ファイルのアップロードエラー',
    'Some files cannot be uploaded with the current model.': '現在のモデルでは一部のファイルをアップロードできません。',
    'Not supported by current model': '現在のモデルでは未対応',
    'Audio files processing requires an audio model': '音声ファイルの処理には音声モデルが必要です',
    'Image processing requires a vision model': '画像処理には視覚モデルが必要です',
    'Video files processing requires a video model': '動画ファイルの処理には動画モデルが必要です',
    'Audio recording not supported': '録音はサポートされていません',
    'Read file': 'ファイルを読み取り',
    'Write file': 'ファイルに書き込み',
    'Edit file': 'ファイルを編集',
    'Read media': 'メディアを読み取り',
    'Read Resource': 'リソースを読み取り',
    'Run command': 'コマンドを実行',
    'Run JavaScript': 'JavaScript を実行',
    'Binary content': 'バイナリ内容',
    'Link': 'リンク',
    'Prompt tokens': '入力トークン数',
    'Generated tokens': '出力トークン数',
    'Total tokens generated': '累計出力トークン',
    'Generation speed': '生成速度',
    'Prompt processing speed': 'プロンプト処理速度',
    'Generation time': '生成時間',
    'Prompt processing time': 'プロンプト処理時間',
    'Generation': '生成',
    'Reasoning': '推論',
    'Context': 'コンテキスト',
    'Context:': 'コンテキスト：',
    'Context window usage of the model the chat runs': 'この会話が使うモデルのコンテキスト使用状況',
    'Connected': '接続済み',
    'Connecting...': '接続中…',
    'Disconnected': '切断',
    'Connection Error': '接続エラー',
    'Connection error - please try again': '接続エラー、もう一度お試しください',
    'Failed to connect to server': 'サーバーに接続できませんでした',
    'Cannot connect to server - check if server is running': 'サーバーに接続できません。起動しているか確認してください',
    'Server is not running or unreachable': 'サーバーが起動していないか、到達できません',
    'Server not found - check server address': 'サーバーが見つかりません。アドレスを確認してください',
    'Server temporarily unavailable': 'サーバーは一時的に利用できません',
    'Server error - check server logs': 'サーバーエラー。ログを確認してください',
    'Server Error': 'サーバーエラー',
    'Request failed': 'リクエスト失敗',
    'Request timed out': 'リクエストがタイムアウトしました',
    'Access denied': 'アクセスが拒否されました',
    'Access denied - check server permissions': 'アクセスが拒否されました。サーバーの権限を確認してください',
    'Invalid API key - please check and try again': 'API キーが無効です。確認して再試行してください',
    'Invalid URL format': 'URL の形式が正しくありません',
    'URL is required': 'URL は必須です',
    'Failed to load': '読み込みに失敗',
    'Failed to export settings': '設定のエクスポートに失敗',
    'Failed to export settings:': '設定のエクスポートに失敗：',
    'Failed to import settings:': '設定のインポートに失敗：',
    'Settings exported': '設定をエクスポートしました',
    'Settings imported successfully': '設定をインポートしました',
    'Invalid settings file: missing config': '設定ファイルが無効：config がありません',
    'Failed to start recording:': '録音の開始に失敗：',
    'Failed to stop recording:': '録音の停止に失敗：',
    'Low': '低',
    'Medium': '中',
    'High': '高',
    'Extra High': '最高',
    'Minimal': '最小',
    'Current time': '現在時刻',
    'No conversations yet': 'まだ会話がありません',
    'New conversation': '新しい会話',
    'Open command picker': 'コマンド一覧を開く',
    'Open prompt picker': 'プロンプト一覧を開く',
    'Open file mention picker': 'ファイルメンション一覧を開く',
    'Open settings': '設定を開く',
    'Open sidebar': 'サイドバーを開く',
    'Close settings': '設定を閉じる',
    'Toggle sidebar': 'サイドバーを切り替え',
    'Send': '送信',
    'Send message': 'メッセージを送信',
    'Attach': '添付',
    'Attach file': 'ファイルを添付',
    'Upload': 'アップロード',
    'Retry': '再試行',
    'Try again': 'もう一度',
    'Thinking': '思考中',
    'Thoughts': '思考',
    'Stop': '停止',
    'Edit message': 'メッセージを編集',
    'Delete this message': 'このメッセージを削除',
    'Copy message': 'メッセージをコピー',
    'More': 'もっと見る',
    'Less': '折りたたむ',
    'Show more': 'もっと表示',
    'Show less': '表示を減らす',
    'Cancel generation': '生成を中止',
    'New': '新規',
    'Rename conversation': '会話名を変更',
    'Open': '開く',
    'Download': 'ダウンロード',
    'Refresh': '更新',
    'Reload': '再読み込み',
    'Sign in': 'サインイン',
    'Sign out': 'サインアウト',
    'Loading models': 'モデルを読み込み中',
    'No models found': 'モデルが見つかりません',
    'Search models': 'モデルを検索',
    'Model': 'モデル',
    'Context size': 'コンテキスト長',
    'Advanced': '詳細設定',
    'Basic': '基本',
    'Close dialog': 'ダイアログを閉じる',
    'Dismiss notification': '通知を閉じる',
    'Export conversation': '会話をエクスポート',
    'Import conversation': '会話をインポート',
    'Clear': 'クリア',
    'Clear all': 'すべてクリア',
    'Apply': '適用',
    'Reset': 'リセット',
    'OK': 'OK',
    'Yes': 'はい',
    'No': 'いいえ',
    'After each response, re-submit the conversation to pre-fill the server KV cache. Makes the next turn faster since the prompt is already encoded while you read the response.': '各応答の後に会話を再送信し、サーバーの KV キャッシュを事前充填します。応答を読んでいる間にプロンプトが符号化されるため、次のターンが速くなります。',
    'Agentic turn limit reached. Continue?': 'エージェントターンの上限に達しました。続けますか？',
    'Always display code blocks at their full natural height, overriding any height limits.': 'コードブロックを常に自然な全高で表示し、高さ制限を無視します。',
    'Browse and attach resources from connected MCP servers to your chat context.': '接続済みの MCP サーバーからリソースを閲覧し、会話コンテキストに添付します。',
    'Configuration, actions and metadata of the selected model.': '選択したモデルの構成・操作・メタデータです。',
    'Configure MCP servers as a JSON list. Use the form in the MCP Client settings section to edit.': 'MCP サーバーを JSON リストで構成します。上の MCP クライアント設定のフォームからも編集できます。',
    'Connect a remote MCP server by URL.': 'URL でリモート MCP サーバーに接続します。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets DRY penalty for the last n tokens.': 'DRY サンプリングは長いコンテキストでも生成テキストの繰り返しを抑えます。このパラメータは直近 n トークンに対する DRY ペナルティを設定します。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets the DRY sampling base value.': 'DRY サンプリングは長いコンテキストでも繰り返しを抑えます。このパラメータは DRY サンプリングの基数を設定します。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets the DRY sampling multiplier.': 'DRY サンプリングは長いコンテキストでも繰り返しを抑えます。このパラメータは DRY サンプリングの倍率を設定します。',
    'DRY sampling reduces repetition in generated text even across long contexts. This parameter sets the allowed length for DRY sampling.': 'DRY サンプリングは長いコンテキストでも繰り返しを抑えます。このパラメータは DRY サンプリングで許容する繰り返し長を設定します。',
    'Display generation statistics (tokens/second, token count, duration) below each assistant message.': '各アシスタントメッセージの下に生成統計（秒あたりトークン数、トークン数、所要時間）を表示します。',
    'Display model tags (e.g. "vision", "reasoning") next to model names throughout the interface.': 'インターフェース全体でモデル名の隣にタグ（「vision」「reasoning」など）を表示します。',
    'Display the current build version in the bottom-right corner of the interface.': 'インターフェース右下に現在のビルドバージョンを表示します。',
    'Display the organization name alongside model names in the model selector, in the trigger and in the model rows.': 'モデル選択・トリガー・モデル一覧で、モデル名の隣に組織名を表示します。',
    'Display the system message at the top of each conversation.': '各会話の先頭にシステムメッセージを表示します。',
    'Enable "Continue" button for assistant messages, including reasoning models.': 'アシスタントメッセージに「続きを生成」ボタンを表示します（推論モデルも含む）。',
    'Enable backend-based samplers. When enabled, supported samplers run on the accelerator backend for faster sampling.': 'バックエンド方式のサンプラーを有効化します。有効にすると対応サンプラーがアクセラレータ上で動作し、より高速になります。',
    'Export conversations': '会話をエクスポート',
    'Download your conversations as a ZIP of JSONL files. This includes all messages, attachments, and conversation history.': '会話を JSONL ファイルの ZIP としてダウンロードします。すべてのメッセージ・添付・会話履歴を含みます。',
    'Export settings': '設定をエクスポート',
    'Export your chat settings and preferences as a JSON file.': 'チャット設定と好みを JSON ファイルとしてエクスポートします。',
    'Import conversations': '会話をインポート',
    'Import one or more conversations from a previously exported ZIP or JSONL file. This will merge with your existing conversations.': '以前エクスポートした ZIP または JSONL ファイルから 1 つ以上の会話をインポートします。既存の会話に統合されます。',
    'Import settings': '設定をインポート',
    'Import chat settings from a previously exported JSON file. This will merge with your existing settings.': '以前エクスポートした JSON ファイルからチャット設定をインポートします。既存の設定に統合されます。',
    'Find models on Hugging Face and download them to the server.': 'Hugging Face でモデルを探してサーバーにダウンロードします。',
    'Group models into families (e.g. "Qwen") in the model picker and the models manager. Turn it off to list every model on its own.': 'モデル選択とモデル管理でシリーズ（「Qwen」など）ごとにグループ化します。オフにすると 1 つずつ並びます。',
    'Images larger than this will be resized before sending to server. Set to 0 to disable.': 'これより大きい画像は送信前に縮小されます。0 で無効になります。',
    'Invalid JSON in custom parameters. Please check the format and try again.': 'カスタムパラメータが有効な JSON ではありません。形式を確認して再試行してください。',
    'Keep tool call details expanded after completion. Takes precedence over "Show tool call in progress", which only covers the in-flight phases.': 'ツール呼び出しの詳細を完了後も展開したままにします。「進行中のツール呼び出しを表示」より優先されます（後者は実行中の段階のみ対象）。',
    'Limits tokens based on the minimum probability for a token to be considered, relative to the probability of the most likely token.': '最も確率の高いトークンに対する相対的な最小確率しきい値で候補を絞り込みます。',
    'Maximum number of tool execution cycles before stopping (prevents infinite loops).': '停止するまでのツール実行の最大サイクル数（無限ループ防止）。',
    'No response received from server. Please try again.': 'サーバーから応答がありません。再試行してください。',
    'Please enter a server URL first.': '先にサーバー URL を入力してください。',
    'Render display math flush left.': '行間数式を左寄せで表示します。',
    'Render display math in leqno style (left-justified tags).': '行間数式を leqno スタイル（式番号を左寄せ）で表示します。',
    'Render the reasoning/thinking block content as formatted Markdown instead of plain text.': '推論/思考ブロックの内容をプレーンテキストではなく Markdown としてレンダリングします。',
    'Sending response for canceled message failed.': 'キャンセルしたメッセージの応答送信に失敗しました。',
    'Show open chats as browser-style tabs above the conversation, one per open chat. When disabled, only one chat is shown at a time.': '開いている会話を会話上部にブラウザ風タブとして表示します（1 会話につき 1 タブ）。オフにすると一度に 1 つだけ表示します。',
    'Show the Discover Models sidebar action to browse and download HuggingFace GGUF models. Turns the Hugging Face Hub API on while it is enabled. Only available in router mode.': 'サイドバーに「モデルを探す」を表示し、Hugging Face の GGUF モデルを閲覧・ダウンロードできます（有効な間は Hub API も有効になります）。ルーターモードでのみ利用できます。',
    'Show the modality and capability icons (vision, audio, reasoning, tools) on the models selector rows.': 'モデル選択の行にモダリティと機能のアイコン（視覚・音声・推論・ツール）を表示します。',
    'Shown once the model is loaded.': 'モデルの読み込み完了後に表示されます。',
    'Sorts and limits tokens based on the difference between log-probability and entropy.': '対数確率とエントロピーの差に基づいてトークンを並べ替え・制限します。',
    'Stop the view from following new content while messages stream, so you control the viewport position yourself.': 'ストリーミング中に新しい内容へ自動追従せず、表示位置を自分で制御できるようにします。',
    'The requested model could not be found. Select an available model to continue.': '要求されたモデルが見つかりません。利用可能なモデルを選んで続行してください。',
    'This is a cross-origin browser request. If the server is reachable from curl or Node but not from the browser, missing CORS headers are the most likely cause.': 'これはクロスオリジンのブラウザリクエストです。curl や Node からは到達できてブラウザからだけ繋がらない場合、CORS ヘッダの欠落が最有力の原因です。',
    'When copying a message with text attachments, combine them into a single plain text string instead of a special format that can be pasted back as attachments.': 'テキスト添付付きのメッセージをコピーするとき、添付に戻せる特殊形式ではなく 1 つのプレーンテキストにまとめます。',
    'XTC sampler cuts out top tokens; this parameter controls the chance of cutting tokens at all. 0 disables XTC.': 'XTC サンプラーは高確率トークンを切り捨てます。このパラメータは切り捨てを実行する確率を制御し、0 で XTC を無効にします。',
    'XTC sampler cuts out top tokens; this parameter controls the token probability that is required to cut that token.': 'XTC サンプラーは高確率トークンを切り捨てます。このパラメータは切り捨てに必要なトークン確率のしきい値を制御します。',
    'No models yet.': 'まだモデルがありません',
    'No models found.': 'モデルが見つかりません',
    'Agentic turn limit reached.': 'エージェントターンの上限に達しました。',
    'Enable "Continue" button': '「続きを生成」ボタンを有効化',
    'JavaScript sandbox tool': 'JavaScript サンドボックスツール',
    'Last steps a compaction keeps as written after the summary: a user message, or an assistant message with its tool results.': '要約の後にそのまま原文で残す末尾ステップ数：ユーザーメッセージ 1 件、またはツール結果付きのアシスタントメッセージ 1 件。',
    'Limits tokens to those that together have a cumulative probability of at least p': '累積確率が p 以上になるトークンのみを残します。',
    'Optional override for the instruction sent to the model when compacting a conversation.': '会話を圧縮するときにモデルへ送る指示の任意の上書き。',
    'Parse PDF as image instead of text. Automatically falls back to text processing for non-vision models.': 'PDF をテキストではなく画像として解析します。視覚非対応のモデルでは自動的にテキスト処理に戻ります。',
    'Permanently delete all conversations and their messages. This action cannot be undone. Consider exporting your conversations first if you want to keep a backup.': 'すべての会話とメッセージを完全に削除します。この操作は元に戻せません。バックアップを残したい場合は先に会話をエクスポートしてください。',
    'Reload app': 'アプリを再読み込み',
    'Render user messages using markdown formatting in the chat. Turn this off to keep a message exactly as typed; @-mention badges show either way.': '会話内のユーザーメッセージを Markdown でレンダリングします。オフにすると入力どおりに表示されます。@ メンションのバッジはどちらでも表示されます。',
    'Send reasoning_format=none so the server returns thinking tokens inline instead of extracting them into a separate field.': 'reasoning_format=none を送り、サーバーが思考トークンを別フィールドに分けずインラインで返すようにします。',
    'Settings are saved in browser\'s localStorage': '設定はブラウザの localStorage に保存されます',
    'Show model tags': 'モデルタグを表示',
    'Show toggle button to display messages as plain text instead of Markdown-formatted content': 'メッセージを Markdown ではなくプレーンテキストで表示する切替ボタンを表示します',
    'Strip thinking from previous messages before sending. When off, thinking is sent back via the reasoning_content field so the model sees its own chain-of-thought across turns.': '送信前に過去メッセージの思考を取り除きます。オフにすると思考は reasoning_content フィールドで返され、モデルは前ターンの思考を参照できます。',
    'The order at which samplers are applied, in simplified way. Default is "top_k;typ_p;top_p;min_p;temperature": top_k->typ_p->top_p->min_p->temperature': 'サンプラーの適用順（簡易表記）。デフォルトは "top_k;typ_p;top_p;min_p;temperature"、実行順は top_k→typ_p→top_p→min_p→temperature',
    'Tool': 'ツール',
    'Reasoning effort': '推論強度',
    'Notifications alt+T': '通知 Alt+T',
    'Scroll left': '左へスクロール',
    'Scroll right': '右へスクロール',
    'Reload app to apply': 'アプリを再読み込みして反映',
    'Set the API Key if you are using': 'サーバー起動時に ',
    'option for the server.': '--api-key オプションを使っている場合は、同じキーをここに入力してください。',
    'Show notification bell and desktop notifications for background events.': 'バックグラウンドのイベントに対して通知ベルとデスクトップ通知を表示します。',
    'Enable chat notifications': 'チャット通知を有効化',
    'Default value': 'デフォルト値',
    'Add New Server': 'サーバーを追加',
    'Add your first MCP server': '最初の MCP サーバーを追加',
    'Always allow': '常に許可',
    'Any context': '任意のコンテキスト',
    'Browser': 'ブラウザ',
    'Conversations': '会話',
    'Delete All': 'すべて削除',
    'Delete all conversations': 'すべての会話を削除',
    'Enabled': '有効',
    'Import': 'インポート',
    'MCP Servers': 'MCP サーバー',
    'Model actions': 'モデル操作',
    'Status': 'ステータス',
    'Search your models': 'モデルを検索',
    'Served by this server': 'このサーバーが提供',
    'Sort by context, lowest first': 'コンテキスト順（低い順）',
    'Sort by model, lowest first': 'モデル順（低い順）',
    'Addon for the temperature sampler. Smoothes out the probability redistribution based on the most probable token.': '温度サンプラーの追加機能。最も確率の高いトークンに基づいて確率の再分配を平滑化します。',
    'Addon for the temperature sampler. The added value to the range of dynamic temperature, which adjusts probabilities by entropy of tokens.': '温度サンプラーの追加機能。動的温度レンジに加算する値で、トークンのエントロピーに応じて確率を調整します。',
    'Applies to new conversations. Tool picks inside a chat only affect that chat.': '新しい会話にのみ適用されます。会話内のツール選択はその会話だけに影響します。',
    'CSS injected into the page at runtime. Set it here, or ship it server side via the --ui-config customCss field.': '実行時にページへ注入する CSS。ここで設定するか、サーバー側で --ui-config の customCss フィールドとして配布できます。',
    'Choose how conversation titles are generated. The first non-empty line uses a fast deterministic rule; the LLM option uses a model-generated title from the first message exchange.': '会話タイトルの生成方法を選びます。最初の空でない行：高速で決定的なルールを使用。LLM：最初のやり取りからモデルが生成したタイトルを使用。',
    'Controls the randomness of the generated text by affecting the probability distribution of the output tokens. Higher = more random, lower = more focused.': '出力トークンの確率分布に影響して生成テキストのランダム性を制御します。高いほどランダム、低いほど集中的になります。',
    'Display full raw model identifiers (e.g. "ggml-org/GLM-4.7-Flash-GGUF:Q8_0") instead of parsed names with badges.': '解析済みの名前とバッジではなく、生のモデル識別子（例 "ggml-org/GLM-4.7-Flash-GGUF:Q8_0"）を完全に表示します。',
    'Display per-turn statistics (tokens, duration) under each turn in agentic responses. Shown only when "Show message generation statistics" is enabled.': 'エージェント応答の各ターンの下に統計（トークン数、所要時間）を表示します。「メッセージ生成の統計を表示」が有効なときのみ表示されます。',
    'Display quantization badges (e.g. Q8_0, Q4_K_M) next to model names throughout the interface.': 'インターフェース全体でモデル名の隣に量子化バッジ（Q8_0、Q4_K_M など）を表示します。',
    'Display the full file system path inside file and folder @-mention badges instead of just the file or folder name.': 'ファイルやフォルダの @ メンションバッジ内に、名前だけでなく完全なパスを表示します。',
    'Expand tool call details while the call is being generated and executed, and collapse them again once its result is in. Mirrors "Show thought in progress". Tool calls you expand or collapse by hand keep your choice.': 'ツール呼び出しの生成・実行中に詳細を自動で展開し、結果が返ったら折りたたみます。「進行中の思考を表示」と対応します。手動で開閉した呼び出しはその選択が保持されます。',
    'Expose a run_javascript tool to the model. Code runs in a Web Worker inside a sandboxed iframe with an opaque origin, isolated from the WebUI and its API, with a hard timeout.': 'モデルに run_javascript ツールを公開します。コードはサンドボックス iframe 内の Web Worker（不透明オリジン）で実行され、WebUI とその API から隔離され、強制タイムアウトがあります。',
    'How many directory levels below the working directory the @-mention file search descends. Larger values surface deeply nested files but take longer on large trees.': '@ メンションのファイル検索が作業ディレクトリから何階層下まで潜るか。値が大きいほど深いファイルも見つかりますが、大きなツリーでは遅くなります。',
    'Load, configure and remove the models this server can run.': 'このサーバーで実行できるモデルを読み込み・設定・削除します。',
    '128K or more': '128K 以上',
    '256K or more': '256K 以上',
    '32K or more': '32K 以上',
    '8K or more': '8K 以上',
    '1M or more': '1M 以上',
    'Architecture': 'アーキテクチャ',
    'Avg speed': '平均速度',
    'Build Info': 'ビルド情報',
    'Context Size': 'コンテキスト長',
    'Delete from disk': 'ディスクから削除',
    'Draft quant': 'ドラフト量子化',
    'Draft repo': 'ドラフトリポジトリ',
    'Draft sidecars': 'ドラフト付属ファイル',
    'Embedding Size': '埋め込み次元',
    'Enable PDF as Images': 'PDF を画像として処理',
    'File Path': 'ファイルパス',
    'Generated': '生成済み',
    'License': 'ライセンス',
    'Max': '最大',
    'Model Size': 'モデルサイズ',
    'Model size': 'モデルサイズ',
    'Off': 'オフ',
    'Parallel Slots': '並列スロット数',
    'Parameters': 'パラメータ数',
    'Prompt': 'プロンプト',
    'Prompt tokens evaluated': '処理済み入力トークン',
    'Quantization': '量子化',
    'See in Discover': '「モデルを探す」で見る',
    'Suggested models': 'おすすめモデル',
    'Symbolic math (nerdamer)': '記号計算（nerdamer）',
    'Tokens generated': '生成トークン',
    'Vocabulary Size': '語彙サイズ',
    'Counterpart of the conversation title radio; stored and synced without a dedicated UI field.': '会話タイトル生成方式のラジオに対応するもう一方の設定。保存・同期されますが専用の UI 欄はありません。',
    'Fetch model display data (avatars, context length, chat template) and everything in the Discover Models view from the Hugging Face Hub API. Locked on while Discover Models is enabled; can be turned on alone for just the display data.': 'Hugging Face Hub API からモデルの表示データ（アイコン、コンテキスト長、チャットテンプレート）と「モデルを探す」画面の内容を取得します。「モデルを探す」が有効な間は固定されます。単独でオンにすると表示データのみ取得します。',
    'Optional template for the title generation prompt. Use {{USER}} for the user message and {{ASSISTANT}} for the assistant message.': 'タイトル生成プロンプトの任意テンプレート。{{USER}} がユーザーメッセージ、{{ASSISTANT}} がアシスタントメッセージです。',
    'Add to favorites': 'お気に入りに追加',
    'Remove from favorites': 'お気に入りから削除',
    'Are you sure you want to delete all conversations? This action cannot be undone and will permanently remove all your conversations and messages.': 'すべての会話を削除しますか？この操作は元に戻せず、すべての会話とメッセージが完全に削除されます。',
    'Choose working directory': '作業ディレクトリを選択',
    'Reset working directory': '作業ディレクトリをリセット',
    'Enter your API key...': 'API キーを入力…',
    'Paste token here': 'ここにトークンを貼り付け',
    'Failed to fetch models': 'モデル一覧の取得に失敗',
    'Failed to load model': 'モデルの読み込みに失敗',
    'Failed to load models': 'モデル一覧の読み込みに失敗',
    'Failed to unload model': 'モデルのアンロードに失敗',
    'Failed to load PDF images': 'PDF 画像の読み込みに失敗',
    'Insert an MCP prompt': 'MCP プロンプトを挿入',
    'Keep model': 'モデルを保持',
    'Load model': 'モデルを読み込む',
    'Unload model': 'モデルをアンロード',
    'Retry loading model': 'モデルの読み込みを再試行',
    'Select model': 'モデルを選択',
    'Path to the media file': 'メディアファイルのパス',
    'Refresh resources': 'リソースを更新',
    'Search conversations...': '会話を検索…',
    'Search models...': 'モデルを検索…',
    'Search resources...': 'リソースを検索…',
    'Search failed': '検索に失敗',
    'Scroll to bottom': '一番下へスクロール',
    'Skip reasoning': '推論をスキップ',
    'Summarize the conversation to free up context': 'この会話を要約してコンテキストを空ける',
    'Unknown error': '不明なエラー',
    'Unknown error occurred': '不明なエラーが発生しました',
    'Unknown error executing prompt': 'プロンプト実行時に不明なエラーが発生しました',
    'Unknown reason': '不明な理由',
    'You have unsaved changes. Are you sure you want to discard them?': '未保存の変更があります。破棄してもよろしいですか？',
    'Determines the markup language of the output.': '出力のマークアップ言語を決定します。',
    'Invalid Base64 string': '無効な Base64 文字列',
    'JavaScript source to execute': '実行する JavaScript のソース',
    'Search and browse AI models, datasets, spaces, and docs on the Hugging Face Hub.': 'Hugging Face Hub でモデル・データセット・Space・ドキュメントを検索・閲覧します。',
    'Search repositories, issues, pull requests and interact with code on GitHub.': 'GitHub でリポジトリ・Issue・プルリクエストを検索し、コードとやり取りします。',
    'Search the web and fetch full page content as clean markdown.': 'ウェブを検索し、ページ全体の内容をクリーンな Markdown として取得します。',
    'Returns the current local date and time in ISO 8601 format, with the IANA time zone name': '現在のローカル日時を IANA タイムゾーン名付きの ISO 8601 形式で返します。',
  };


  /* ================= 引擎 ================= */

  var LANG_KEY = 'llamacpp.ui.lang';
  var lang = 'zh';
  try {
    var _saved = localStorage.getItem(LANG_KEY);
    lang = (_saved === 'en' || _saved === 'ja') ? _saved : 'zh';
  } catch (e) { }

  var PATTERNS_ZH = [
    [/^([0-9]+) +messages?$/i, '$1 条消息'],
    [/^([0-9]+) +tokens?$/i, '$1 token'],
    [/^([0-9]+) +files?$/i, '$1 个文件'],
    [/^([0-9]+) +characters?$/i, '$1 个字符'],
    [/^([0-9]+)% used$/i, '已用 $1%'],
    [/^([0-9]+) models?$/i, '$1 个模型'],
    [/^([0-9]+) tools?$/i, '$1 个工具'],
    [/^([0-9]+) conversations?$/i, '$1 个对话'],
    [/^Default: *(.+)$/i, '默认：$1']
  ];

  var PATTERNS_JA = [
    [/^([0-9]+) +messages?$/i, '$1 件のメッセージ'],
    [/^([0-9]+) +tokens?$/i, '$1 トークン'],
    [/^([0-9]+) +files?$/i, '$1 個のファイル'],
    [/^([0-9]+) +characters?$/i, '$1 文字'],
    [/^([0-9]+)% used$/i, '使用率 $1%'],
    [/^([0-9]+) models?$/i, '$1 個のモデル'],
    [/^([0-9]+) tools?$/i, '$1 個のツール'],
    [/^([0-9]+) conversations?$/i, '$1 件の会話'],
    [/^Default: *(.+)$/i, 'デフォルト：$1']
  ];

  /* 当前语言对应的词典与单复数模板 */
  function table() { return lang === 'ja' ? DICT_JA : DICT; }
  function patterns() { return lang === 'ja' ? PATTERNS_JA : PATTERNS_ZH; }

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, KBD: 1, SAMP: 1 };
  var SKIP_CLASS = ['prose', 'markdown-body', 'message-content', 'llama-plugin-badge', 'zhcn-lang'];

  /* 原文存档：切回英文时逐字还原 */
  var origTitle = null;
  var origText = new Map();
  var origAttr = new Map();

  function lookup(text) {
    if (!text) return null;
    var t = String(text).trim();
    if (!t) return null;
    var T = table();
    if (Object.prototype.hasOwnProperty.call(T, t)) return T[t];
    if (t.length > 11 && t.slice(-11) === ' - llama-ui') {
      var head = t.slice(0, -11);
      if (Object.prototype.hasOwnProperty.call(T, head)) return T[head] + ' - llama-ui';
    }
    var norm = t.replace(new RegExp('  +', 'g'), ' ');
    if (norm !== t && Object.prototype.hasOwnProperty.call(T, norm)) return T[norm];
    var PS = patterns();
    for (var i = 0; i < PS.length; i++) {
      if (PS[i][0].test(norm)) return norm.replace(PS[i][0], PS[i][1]);
    }
    return null;
  }

  function skipElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (SKIP_TAGS[el.tagName]) return true;
    if (el.isContentEditable) return true;
    var cls = (el.getAttribute && el.getAttribute('class')) || '';
    for (var i = 0; i < SKIP_CLASS.length; i++) {
      if (cls.indexOf(SKIP_CLASS[i]) >= 0) return true;
    }
    return false;
  }

  function inSkipped(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    while (el) {
      if (skipElement(el)) return true;
      el = el.parentElement;
    }
    return false;
  }

  var translated = 0;

  function translateTextNode(node) {
    if (inSkipped(node)) return false;
    var raw = node.nodeValue;
    if (!raw) return false;
    var t = raw.trim();
    if (!t || t.length > 300) return false;
    var out = lookup(t);
    if (out == null || out === t) return false;
    var at = raw.indexOf(t);
    origText.set(node, raw);
    node.nodeValue = raw.slice(0, at) + out + raw.slice(at + t.length);
    translated++;
    return true;
  }

  function translateAttrs(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var name = ATTRS[i];
      var v = el.getAttribute(name);
      if (!v) continue;
      var out = lookup(v);
      if (out != null && out !== v) {
        var store = origAttr.get(el);
        if (!store) { store = {}; origAttr.set(el, store); }
        if (!Object.prototype.hasOwnProperty.call(store, name)) store[name] = v;
        el.setAttribute(name, out);
      }
    }
  }

  function translateTitle() {
    if (lang === 'en') return;
    try {
      var t = document.title;
      if (!t) return;
      var parts = t.split(' - ');
      if (parts.length < 2) return;
      var headT = table()[parts[0]];
      if (!headT) return;
      origTitle = t;
      document.title = headT + ' - ' + parts.slice(1).join(' - ');
    } catch (e) { }
  }

  function walk(root) {
    if (!root) return;
    if (root === document.body) translateTitle();
    if (root.nodeType === 3) { translateTextNode(root); return; }
    if (root.nodeType !== 1) return;
    translateAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 1) translateAttrs(n);
      else translateTextNode(n);
    }
  }

  /* 切回英文：把存下的原文写回去 */
  function restoreAll() {
    if (origTitle !== null) { try { document.title = origTitle; } catch (e) { } origTitle = null; }
    origText.forEach(function (value, node) {
      try { if (node && node.nodeType === 3) node.nodeValue = value; } catch (e) { }
    });
    origAttr.forEach(function (store, el) {
      try {
        if (!el || !el.getAttribute) return;
        for (var k in store) el.setAttribute(k, store[k]);
      } catch (e) { }
    });
    origText.clear();
    origAttr.clear();
    translated = 0;
  }

  var queue = [];
  var scheduled = false;

  function flush() {
    scheduled = false;
    var list = queue;
    queue = [];
    for (var i = 0; i < list.length; i++) {
      try { walk(list[i]); } catch (e) { }
    }
    translateTitle();
    if (origText.size > 8000) sweep();
  }

  function sweep() {
    origText.forEach(function (v, node) { if (!node.isConnected) origText.delete(node); });
    origAttr.forEach(function (v, el) { if (!el.isConnected) origAttr.delete(el); });
  }

  function schedule(node) {
    if (!node || lang === 'en') return;
    queue.push(node);
    if (queue.length > 400) queue = [document.body];
    if (scheduled) return;
    scheduled = true;
    setTimeout(flush, 40);
  }

  /* ---------- 语言切换按钮 ---------- */

  function buildSwitcher() {
    if (document.getElementById('zhcn-lang')) return;
    var box = document.createElement('div');
    box.id = 'zhcn-lang';
    box.className = 'zhcn-lang';
    box.innerHTML =
      '<button type="button" class="zhcn-btn" title="切换界面语言 Switch language">' +
      '<span class="zhcn-globe">🌐</span><span class="zhcn-cur"></span><span class="zhcn-caret">▾</span>' +
      '</button>' +
      '<div class="zhcn-menu" hidden>' +
      '<div class="zhcn-item" data-lang="zh"><span>中文</span><span class="zhcn-tick">✓</span></div>' +
      '<div class="zhcn-item" data-lang="ja"><span>日本語</span><span class="zhcn-tick">✓</span></div>' +
      '<div class="zhcn-item" data-lang="en"><span>English</span><span class="zhcn-tick">✓</span></div>' +
      '</div>';

    var btn = box.querySelector('.zhcn-btn');
    var menu = box.querySelector('.zhcn-menu');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      syncSwitcher();
    });
    box.querySelectorAll('.zhcn-item').forEach(function (it) {
      it.addEventListener('click', function (e) {
        e.stopPropagation();
        setLang(it.getAttribute('data-lang'));
        menu.hidden = true;
      });
    });
    document.addEventListener('click', function () { menu.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.hidden = true; });

    document.body.appendChild(box);
    syncSwitcher();
  }

  function syncSwitcher() {
    var cur = document.querySelector('#zhcn-lang .zhcn-cur');
    if (cur) cur.textContent = lang === 'zh' ? '中文' : (lang === 'ja' ? '日本語' : 'English');
    document.querySelectorAll('#zhcn-lang .zhcn-item').forEach(function (it) {
      it.classList.toggle('is-active', it.getAttribute('data-lang') === lang);
    });
  }

  function setLang(next) {
    next = (next === 'en' || next === 'ja') ? next : 'zh';
    /* 切到任何语言前先把英文原文写回去，否则中文→日文匹配不到英文键 */
    restoreAll();
    lang = next;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { }
    if (lang !== 'en') walk(document.body);
    syncSwitcher();
    return (typeof next !== 'undefined') ? true : false;
  }

  /* ---------- 启动 ---------- */

  function boot() {
    buildSwitcher();
    if (lang !== 'en') walk(document.body);

    var obs = new MutationObserver(function (muts) {
      if (lang === 'en') return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'characterData') schedule(m.target);
        else if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) schedule(m.addedNodes[j]);
        } else if (m.type === 'attributes') schedule(m.target);
      }
    });
    obs.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });

    /* 按钮被路由重绘冲掉时补回来 */
    setInterval(function () {
      if (!document.getElementById('zhcn-lang')) buildSwitcher();
      translateTitle();
    }, 1500);
  }

  window.__zhCN = {
    dict: DICT,
    dictJa: DICT_JA,
    jaSize: Object.keys(DICT_JA).length,
    size: Object.keys(DICT).length,
    lookup: lookup,
    get lang() { return lang; },
    setLang: setLang,
    rescan: function () { translated = 0; walk(document.body); return translated; },
    count: function () { return translated; },
    restore: restoreAll
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
