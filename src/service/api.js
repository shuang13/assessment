/**
 * API 接口统一管理
 */
export default {
    BASEURL: 'http://localhost:2000/', // BASE_URL

    login: '/nmid/login', // 登录

    stuInfo: '/nmid/stuInfo', // 获取指定学生的个人信息

    stuList: '/nmid/stuList', // 获取所有学生的个人信息

    stuPrizes: '/nmid/stuPrizes', // 获取指定学生的所有奖项

    classStu: '/nmid/classStu', // 获取指定班级所有学生的信息

    loginLog: '/nmid/loginLog', // 获取指定学生的登录记录

    classes: '/nmid/classes', // 获取所有班级号列表

    status: '/nmid/status', // 更新奖项审核状态

    delPrize: '/nmid/delPrize', // 删除一条奖项

    upload: '/nmid/upload', // 新增一条奖项

    uploadFile: '/nmid/uploadFile', // 新增一条奖项

    update: '/nmid/update', // 修改一条奖项

    updateRemake: '/nmid/updateRemake', // 修改备注

    rule: '/nmid/rule', // 评分规则

    adminLogin: '/nmid/adminLogin', //管理员登录

    tecLogin: '/nmid/tecLogin', //教师登录

    verRemark: '/nmid/verRemark', //教师添加备注

    download: '/nmid/download', //材料下载

    teaList: '/nmid/teaList', //获取老师列表

    addTeacher: '/nmid/addTeacher', //添加教师账号

    classRange: '/nmid/classRange', //修改教师属下班级

    teaLoginLog: '/nmid/teaLoginLog', //教师登录日志

    admLoginLog: '/nmid/admLoginLog', //管理员登录日志

}