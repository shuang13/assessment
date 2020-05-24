<template>
    <div class="TeacherLog">
        <div class="inner-box">
            <div class="op-header">
            </div>
            <Table ref="selection" height="420" :columns="th" :data="tableData"></Table>
        </div>
    </div>
</template>
<script>
export default {
    name:'TeacherLog',
    data() {
        return {
            stuId: sessionStorage.getItem("stuId"), //学号
            th: [
                {
                    title: '序号',
                    key: 'id'
                },
                {
                    title: '账号',
                    key: 'teachername'
                },
                {
                    title: '登录IP',
                    key: 'lastip'
                },
                {
                    title: '上次登录',
                    key: 'lastlogin'
                }
            ],
            tableData: [],
        }
    },
    watch: {

    },
    methods: {
        // 获取申请记录
        getData() {
            this.$http.get(this.$api.teaLoginLog, {id: sessionStorage.getItem('id')})
            .then(res => {
                if(res.status === '200'){
                    this.tableData = res.data.reverse();
                    this.tableData.forEach(e => {
                        e.lastlogin = this.getLocalTime(e.lastlogin);
                    })
                } 
            })
        },
        getLocalTime(date) {     
            var dateee = new Date(date).toJSON();
            return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }
    },
    mounted(){
        this.getData();
    }
}
</script>
<style lang="less">
    .inner-box {
        position: relative;
        height: 500px;
        border-radius: 4px;
        background: #fff;
    }
    .op-header {
        padding: 20px 20px 0 20px;
    }
    Table {
        width: 100%;
    }
</style>
