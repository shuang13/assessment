<template>
    <div class="startStudent">
        <div class="inner-box">
            <div class="op-header">
                <div class="switch">
                    学生端开关
                    <i-switch size="large">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                    </i-switch>
                </div>
                

                <Modal
                    width="360"
                    v-model="uploadModal"
                    title="编辑用户"
                    @on-ok="ok"
                    @on-cancel="cancel">
                    <Form v-model="formItem" :label-width="80">
                        <FormItem label="姓名">
                            <Input v-model="formItem.name" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem label="学院">
                            <Input v-model="formItem.academy" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem label="管理班级">
                            
                            <div>
                                <Input v-model="classInput" placeholder="Enter something...">
                                    <span  slot="append" @click="handleAdd" style="cursor: pointer">添加班级</span>
                                </Input>
                                
                            </div>
                            <Tag v-for="item in formItem.classlist" :key="item" :name="item" closable @on-close="handleClose">班级{{ item  }}</Tag>
                        </FormItem>
                        <FormItem label="邮箱">
                            <Input v-model="formItem.email" type="email" placeholder="Enter something..."/>
                        </FormItem>
                       
                    </Form>
                </Modal>
            </div>
            <Table ref="selection" height="420" :columns="th" :data="tableData"></Table>
        </div>
    </div>
</template>
<script>
export default {
    name:'StartStudent',
    data() {
        return {
            stuId: sessionStorage.getItem("stuId"), //学号

            formItem: '',
            uploadModal: false, //上传弹窗

            th: [
                {
                    title: '序号',
                    key: 'id'
                },
                {
                    title: '账号',
                    key: 'adminname'
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
            
            formItem: {
                name: '',
                academy: '',
                classlist: [],
                email: ''
            },
            classInput: '',
            tableData: [],
            // 修改弹窗标志
            modifyFlag: false,
        }
    },
    watch: {

    },
    methods: {
        ok () {
            if (this.modifyFlag) {
                this.$http.post(this.$api.update, this.formItem)
                .then(res => {
                    if(res.status === '200'){
                        this.$Message.error('操作成功！');
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })
            } else {
                this.$http.post(this.$api.upload, this.formItem)
                .then(res => {
                    if(res.status === '200'){
                        this.$Message.error('操作成功！');
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })
            }
            
            this.$Message.info('Clicked ok');
        },
        cancel () {
            this.$Message.info('Clicked cancel');
        },
        // 添加班级
        handleAdd () {
            this.formItem.classlist.push(this.classInput);
        },
        // 取消添加班级
        handleClose (event, name) {
            const index = this.formItem.classlist.indexOf(name);
            this.formItem.classlist.splice(index, 1);
        },
        // 删除
        handleDelete(index) {
            this.$http.post(this.$api.delPrize, {})
            .then(res => {
                if(res.status === '200'){
                    this.$Message.error('操作成功！');
                } else {
                    this.$Message.error('操作失败！');
                }
            })    
        },
        // 上传
        uploadHandle() {
            this.uploadModal = true;
         
        },
        handleUploadFile(file) {
            this.file = file;
        },
        // 修改
        handleModify(index) {
            this.uploadModal = true;
            this.modifyFlag = true;
            
        },
        // 获取申请记录
        getData() {
            this.$http.get(this.$api.admLoginLog, {id: sessionStorage.getItem('id')})
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

        .switch {
            margin-right: 5px;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .table-filter {
            height: 40px;
            line-height: 40px;
        }
    }
    Table {
        width: 100%;
    }
</style>
