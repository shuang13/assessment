import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Student from '@/components/Student'
import StudentUpload from '@/components/StudentUpload'
import StudentResult from '@/components/StudentResult'
import Teacher from '@/components/Teacher'
import Remark from '@/components/Remark'
import Download from '@/components/Download'
import EditRule from '@/components/EditRule'
import Admin from '@/components/Admin'
import StartStudent from '@/components/StartStudent'
import UserRole from '@/components/UserRole'
import Log from '@/components/Log'
import TeacherLog from '@/components/TeacherLog'

import Test from '@/components/Test'
Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/',
        name: 'Login',
        component: Login
    }, {
        path: '/index',
        name: 'Index',
        component: Index,
        children: [{
            path: '/student',
            name: 'Student',
            component: Student,
            children: [{
                path: '/log',
                name: 'Log',
                meta: {
                    requireAuth: true
                },
                component: Log
            }, {
                path: '/studentUpload',
                name: 'StudentUpload',
                meta: {
                    requireAuth: true
                },
                component: StudentUpload
            }, {
                path: '/studentResult',
                name: 'StudentResult',
                meta: {
                    requireAuth: true
                },
                component: StudentResult
            }]
        }, {
            path: '/teacher',
            name: 'Teacher',
            component: Teacher,
            children: [{
                path: '/teacherLog',
                name: 'TeacherLog',
                meta: {
                    requireAuth: true
                },
                component: TeacherLog
            }, {
                path: '/remark',
                name: 'Remark',
                meta: {
                    requireAuth: true
                },
                component: Remark
            }, {
                path: '/download',
                name: 'Download',
                meta: {
                    requireAuth: true
                },
                component: Download
            }, {
                path: '/editRule',
                name: 'EditRule',
                meta: {
                    requireAuth: true
                },
                component: EditRule
            }]
        }, {
            path: '/admin',
            name: 'Admin',
            component: Admin,
            children: [{
                path: '/startStudent',
                name: 'StartStudent',
                meta: {
                    requireAuth: true
                },
                component: StartStudent
            }, {
                path: '/userRole',
                name: 'UserRole',
                meta: {
                    requireAuth: true
                },
                component: UserRole
            }]
        }, {
            path: '/test',
            name: 'Test',
            component: Test
        }]
    }, {
        path: '*',
        redirect: '/'
    }]
})
//注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
    //获取store里面的token
    let token = store.state.token;
    //判断要去的路由有没有requiresAuth
    if (to.meta.requireAuth) {

        if (token) {
            next();

        } else {

            next({
                path: '/login',
            });
        }
    } else {
        next();
    }
});
export default router;