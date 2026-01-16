创建 portfolio 文件夹再写 index.js 等同于直接写 portfolio.js 文件

Nested folders: 在文件夹内除 index.js 以外的文件内写(如此处的 list.js)

Dynamic 用[]包裹文件名，文件名可以任意起名，返回一个对象，包含文件名:url 的键值对

Catch-All Dynamic Routers 用 [...slug] 文件，其 router 返回一个数组

React hooks 加 {}，Next 内置组件不加

JSX 遇到 只有属性名(replace)，没有 = 默认就是 true（HTML 语法继承来的）

字符串加不加{}都表示一个意思，别的如变量等需要加{}进入 js 模式(或者 ts， whatever)
