<template>
    <div class="student">
        <div class="content-right">
            <div class="content-inner">
            
                <router-view></router-view>
            </div>
        </div>
        <div class="aside">
            <Menu ref="menu" active-name="1" style="width: 160px; border-radius: 4px; float: left; margin-right: 10px;">
                <MenuItem :to="{path:'/log'}" name="1">首页</MenuItem>
                <MenuItem :to="{path:'/studentUpload'}" name="2">测评材料上传</MenuItem>
                <MenuItem :to="{path:'/studentResult'}" name="3">结果分析</MenuItem>
            </Menu>
        </div>
    </div>
</template>
<script>
export default {
    name:'Student',
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
                path:'/log'
            }
        )
    }
}
</script>
<style lang="less">
    .student {
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