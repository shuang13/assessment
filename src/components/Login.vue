<template>
    <div class="login">
        <div class="inner-box">
            <div class="logo-box">
                <i class="logo"></i>
                <i class="logo-text"></i>
            </div>
            <div class="title"></div>
            <div class="login-item">
                <i class="user-icon"></i><input type="text" maxlength="16" v-model="stuId" placeholder="账号">
            </div>
            <div class="login-item">
                <i class="pass-icon"></i><input type="password" maxlength="16" v-model="password" @keyup.enter="login" placeholder="密码">
            </div>
            <button @click="login">登&nbsp录</button>  
            <div class="inform">
                <p>*1. 学生账号为学号，初始密码为身份证后6位；</p>
                <p>*2. 教工账号为学院教学秘书统一向教务处教学信息中心申请；</p>
            </div> 
        </div>

    </div>
</template>
<script>
export default {
    name: 'Login', 
    data() {
        return {
            stuId:'',
            password:'',
        }
    },
    created() {
        this.$Notice.warning({
            title:'温馨提示',
            desc:'推荐使用Google Chrome和Firefox浏览器。<br>不建议使用IE浏览器访问本网站。',
            duration:10
        })
    },
    methods: {
        login() {
            if(this.password=='' || this.stuId=='') {
                this.$Message.warning('请输入正确的账号或者密码');
            } else {
                
                let user = '';
                if (this.stuId == 'admin') {
                    var data = new FormData();
                    data.append('adminname',this.stuId);
                    data.append('pwd',this.password);

                    user = this.$api.adminLogin;
                } else if(/^\d{10}$/.test(this.stuId)) {
                    var data = new FormData();
                    data.append('stuid',this.stuId);
                    data.append('pwd',this.password);

                    user = this.$api.login;
                } else {
                    var data = new FormData();
                    data.append('teachername',this.stuId);
                    data.append('pwd',this.password);
                    user = this.$api.tecLogin;
                }
                let res = this.$http.post(user, data)
                res.then(result => {
                    if(result.status === '200') {
                        this.$Message.success('登录成功');
                        //通过action提交mutation，进行分发
                        this.$store.dispatch('UserLogin', true);
                        
                        // 判断权限 1--学生 2--教师 3--管理员
                        if (result.right == "1") {
                            sessionStorage.setItem('stuId', this.stuId);
                            this.$router.push(
                                {
                                    path:'/student',
                                }
                            )
                        } else if(result.right == "2") {
                            sessionStorage.setItem('stuId', this.stuId);
                            sessionStorage.setItem('classrange', result.data.classrange.replace(/\[|\]/g, ''));
                            sessionStorage.setItem('id', result.data.id);
                            this.$router.push(
                                {
                                    path:'/teacher'
                                }
                            )
                        } else if(result.right == "3") {
                            sessionStorage.setItem('stuId', this.stuId);
                            sessionStorage.setItem('id', result.data.id);

                            this.$router.push(
                                {
                                    path:'/admin',
                                }
                            )
                        }
                        
                    } else {
                        this.$Message.error('账号或者密码错误');
                    }
                })
                
            }
        }
    }
}
</script>
<style lang="less">
    .login {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: url('../assets/imgs/bg.jpg') no-repeat center center;
        background-size: 100% 100%;
        .inner-box {
            width: 350px;
            height: 450px;
            background: rgba(255, 255, 255, 0.5);
            text-align: center;
        }
        i {
            display: inline-block;

        }
        .logo-box {
            text-align: left;
            .logo {
                width: 50px;
                height: 50px;
                background: url('../assets/imgs/login/logo.png') no-repeat center center;
                background-size: 60% 60%;

            }
            .logo-text {
                width: 160px;
                height: 50px;
                background: url('../assets/imgs/login/logo_text.png') no-repeat center center;
                background-size: 60% 60%;
                margin-left: -40px;
            }
        }
        .title {
            height: 80px;
            background: url('../assets/imgs/login/title.png') no-repeat center center;

        }
        .login-item {
            i {
                position: absolute;
                width: 40px;
                height: 40px;
            }
            .user-icon {
                background: url('../assets/imgs/login/username.png') no-repeat center center;
            }
            .pass-icon {
                background: url('../assets/imgs/login/password.png') no-repeat center center;;
            }
            input {
                padding-left: 45px;
                margin-bottom: 20px;
                border-radius: 2px;
                outline: none;
            }
        }
        .inform {
            margin-top: 40px;
            font-size: 12px;
            color: red;
            p {
                line-height: 20px;
            }
        }
        input {
            width: 295px;
            height: 40px;
            border: none;
        }
        button {
            width: 295px;
            height: 40px;
            border: none;
            cursor: pointer;
            font-size: 18px;
            outline: none;
            background-color: #EBFA1F;
            &:hover {
                background-color: #E0F010;
            }
        }
    }
</style>
