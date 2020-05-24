# assessment

> 综合测评系统
> 

Vue/Webpack/iView/Echarts/Axios/vue-json-excel

###功能简述

学生在线申报测评项和上传测评材料，以此规范和简化申报流程。教师实时进行审核授分，及时反馈审核状态，数据管理便捷，教务管理更高效。基于综合测评体系，统一评分规则，测评结果更加公平准确，有效体现综合素质教育水平。

## 需求
1. 用户登录：包括登录界面和首页界面
2. 角色管理：系统分为学生端、教师端和管理员端，通过对用户进行角色分离从而进行权限控制
3. 申报管理：对申报测评项的增、删、改、查以及相关数据统计等
4. 审核管理：对学生申报的测评项进行查看、单项审核、批量审核、增改备注等
5. 测评成绩管理：对个人测评成绩进行数据可视化分析，对班级成绩进行查看和Excel导出
6. 测评规则管理：对测评规则进行树状图展示和分数修改操作

## 其他
db.json 为mock测试数据和学院测评规则

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

