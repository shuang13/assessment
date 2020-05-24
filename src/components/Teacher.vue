<template>
    <div class="teacher">
        <div class="content-right">
            <div class="content-inner">
                <router-view></router-view>
            </div>
        </div>
        <div class="aside">
            <Menu ref="menu" :active-name="calssSelectName" :open-names="openName" style="width: 160px; border-radius: 4px; float: left; margin-right: 10px;">
                <MenuItem :to="{path:'/teacherLog'}" name="0">首页</MenuItem>
                <Submenu name="1">
                    <template slot="title">
                        测评材料审核
                    </template>
                    <MenuItem :to="{path:'/remark', query:{classnum: item.classnum}}" :name="'1-' + (index + 1)" v-for="(item, index) in classList" :key="index">{{ item.classnum }}</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        测评情况
                    </template>
                    <MenuItem :to="{path:'/download'}" name="2-1">结果下载</MenuItem>
                    <MenuItem :to="{path:'/editRule'}" name="2-2">评分规则</MenuItem>
                </Submenu>
            </Menu>
        </div>
    </div>
</template>
<script>
export default {
    name:'Teacher',
    data() {
        return {
            openName: ['0'],
            calssSelectName: '0',
            // 必须事先放入空对象，不然active-name失效
            classList: [{
                classnum: '加载中...'
            }],
            index: 0
        }
    },
    methods: {
        // 获取班级列表
        getData() {
            this.$http.get(this.$api.classes)
            .then(res => {
                if(res.status === '200'){
                    this.classList = [];
                    let data = res.data;
                    let classrange = sessionStorage.getItem('classrange').split(',');
                    classrange.forEach(e => {
                         data.forEach(k => {
                            if(k.id == e){
                                this.classList.push({classnum: k.classnum});
                            }
                        });
                    })

                    this.$router.push(
                        {
                            path:'/teacherLog'
                        }
                    )
                } else {
                    this.$Message.error('操作失败！');
                }
            });
        }
    },
    mounted(){
        this.getData();
    }
}
</script>
<style lang="less">
    .teacher {
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
