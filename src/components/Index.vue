<template>
    <div class="index">
        <div class="header">
            <div class="header-mid">
                <div class="title"></div>
            </div>
            <div class="header-left">
                <i class="logo"></i>
                <i class="logo-text"></i>
            </div>
            <div class="header-right">
                <span>欢迎你！{{stuId}}</span>
                <span @click="layoutHandle">注销</span>
            </div>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    name:'Index',
    data() {
        return {
            stuId: sessionStorage.getItem("stuId")
        }
    },
    methods: {
        layoutHandle() {
            this.$store.dispatch('UserLogout');
            this.$router.push(
                {
                    path:'/login',
                }
            )
        }
    }
}
</script>
<style lang="less">
    .index {
        width: 100%;
        height: 100%;
        background: url('../assets/imgs/bg.jpg') no-repeat center center;
        background-size: 100% 100%;
    }
    .header {
        height: 60px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.5);
        line-height: 60px;
        .header-left {
            float: left;
            margin-left: -100%;
            padding: 0 20px;
            overflow: hidden;
            i {
                display: inline-block;
            }
            .logo {
                width: 60px;
                height: 60px;
                background: url('../assets/imgs/login/logo.png') no-repeat center center;
                background-size: 40px 40px;
            }
            .logo-text {
                width: 120px;
                height: 60px;
                background: url('../assets/imgs/logo_text2.png') no-repeat center center;
                background-size: 120px 36px;

            }
        }
        .header-mid {
            float: left;
            width: 100%;
            .title {
                margin: 0 auto;
                width: 150px;
                height: 60px;
                background: url('../assets/imgs/title_text2.png') no-repeat center center;
                background-size: 150px 30px;
            }
        }
        .header-right {
            float: left;
            margin-left: -240px;
            width: 240px;
            height: 60px;
            color: #fff;
            width: 200px;
            text-align: center;
            cursor: pointer;
            span {
                margin-right: 10px;
            }
        }
    }
    .content {
        margin-top: 25px;
        padding: 0 10px;
        height: 550px;
        // background-color: #eeeeee;
    }
</style>
