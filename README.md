default 任务
    页面结构可配置的

    第三方的 css 和 js 可以选择是手动插入的到 html  页面 或是在配置文件指定 可以自动  插入 进行 编译成一个文件

    插入的js 和 css  会根据特定的文件名 进行优先级排序 

    通用的 html  页面模板 可以在 html 文件中插入 处理html 的时候户自动插入
    通用 模板上面的 js  和  css 可以在配置文件中指定 会自动 加入到页面里面 默认优先级会高于 每个具体页面上面的 js  和 css  文件

    1.自动监听 pages下 css js 文件的新增删除更新 html 文件上的引用 只触发 html 文件的处理任务 
    2.自动监听 pages 下面 html 文件的修改 只触发对应的 html 处理任务

build 任务
    对插入 HTML 里面的 js  css 引用 进行文件合并并且 压缩 
MD5 任务
    对 build 任务里面的 js  css 进行 MD5 计算 之后更新 html 里面的引用