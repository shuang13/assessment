<template>
    <div class="admin">
        <div class="content-right">
            <div class="content-inner">
            
                <router-view></router-view>
            </div>
        </div>
        <div class="aside">
            <Menu ref="menu" active-name="1" style="width: 160px; border-radius: 4px; float: left; margin-right: 10px;">
                <MenuItem :to="{path:'/startStudent'}" name="1">学生端管理</MenuItem>
                <MenuItem :to="{path:'/userRole'}" name="2">角色管理</MenuItem>
            </Menu>
        </div>
    </div>
</template>
<script>
export default {
    name:'Admin',
    data() {
        return {
        }
    },
    watch: {
    },
    methods: {
    },
    mounted(){
        this.$router.push(
            {
                path:'/startStudent'
            }
        )
    }
}
</script>
<style lang="less">
    .admin {
        overflow: hidden;
        .aside {
            float: left;
            margin-left: -100%;
            width: 160px;
            height: 100%;
            Menu {
                float: left;
            }
        }
        .content-right {
            float: left;
            width: 100%;
            height: 550px;
            .content-inner {
                padding-left: 170px;
                width: 100%;
                height: 550px;
                border-radius: 4px;
                
            }
        }
    }
</style>