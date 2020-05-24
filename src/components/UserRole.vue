<template>
    <div class="userRole">
        <div class="inner-box">
            <div class="op-header">
                <Button type="primary" @click="uploadHandle">添加用户</Button>
                <Modal
                    width="360"
                    v-model="uploadModal"
                    title="编辑用户"
                    @on-ok="ok"
                    @on-cancel="cancel">
                    <Form v-model="formItem" :label-width="80">
                        <FormItem label="姓名">
                            <Input v-model="formItem.teachername" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem label="密码">
                            <Input v-model="formItem.pwd" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem label="学院">
                            <Input v-model="formItem.college" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem label="管理班级">
                            
                            <div>
                                <Input v-model="classInput" placeholder="Enter something...">
                                    <span  slot="append" @click="handleAdd" style="cursor: pointer">添加班级</span>
                                </Input>
                                
                            </div>
                            <Tag v-for="item in classlist" :key="item" :name="item" closable @on-close="handleClose">班级{{ item  }}</Tag>
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
    name:'userRole',
    data() {
        return {
            stuId: sessionStorage.getItem("stuId"), //学号

            formItem: '',
            uploadModal: false, //上传弹窗

            th: [
                {
                    title: '姓名',
                    key: 'teachername'
                },
                {
                    title: '学院',
                    key: 'college'
                },
                {
                    title: '管理班级',
                    key: 'classrange',
                },
                {
                    title: '邮箱',
                    key: 'email'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleModify(params.index);
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleDelete(params.index);
                                    }
                                }
                            }, '删除')
                        ]); 
                    }
                }
            ],
            
            formItem: {
                teachername: '',
                pwd: '',
                college: '',
                classrange: [],
                email: ''
            },
            classInput: '',
            tableData: [],
            // 修改弹窗标志
            modifyFlag: false,
            classList: [],
            classlist: [],
            current: {}
        }
    },
    watch: {

    },
    methods: {
        ok () {
            if (this.modifyFlag) {
                let data = new FormData();
                this.formItem.classrange = this.formItem.classrange.join();
                
                data.append('teacherid', this.current.id);
                data.append('classRange', this.formItem.classrange);
                console.log(this.formItem.id, this.formItem.classrange, this.$api.classRange)
                this.$http.post(this.$api.classRange, data)
                .then(res => {
                    if(res.status === '200'){
                        this.getData();
                        this.$Message.error('操作成功！');
                    } else {
                        this.$Message.error('操作失败！');
                    }
                })
            } else {
                let data = new FormData();
                this.formItem.classrange = '[' + this.formItem.classrange.join() + ']';

                data.append('teacher', JSON.stringify(this.formItem));
                console.log(this.formItem.classrange, this.formItem)

                this.$http.post(this.$api.addTeacher, data)
                .then(res => {
                    if(res.status === '200'){
                        this.getData();
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
            this.classList.forEach(e => {
                if (this.modifyFlag) {
                    this.classlist.forEach(k => {
                        if(e.classnum == k){
                            this.formItem.classrange.push(e.id);
                        }
                    })
                }
                if(e.classnum == this.classInput){
                    this.formItem.classrange.push(e.id);
                    this.classlist.push(this.classInput);
                }
            });

        },
        // 取消添加班级
        handleClose (event, name) {
            const index = this.classlist.indexOf(name);
            this.classlist.splice(index, 1);
            this.classList.forEach(e => {
                this.classlist.forEach(k => {
                    if(e.classnum == k){
                        this.formItem.classrange.push(e.id);
                    }
                })

            });
            console.log('close')
            
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
            this.classlist = [];
            this.formItem = {
                teachername: '',
                pwd: '',
                college: '',
                classrange: [],
                email: ''
            };;
        },
        // 修改
        handleModify(index) {
            this.uploadModal = true;
            this.modifyFlag = true;
            this.current = this.tableData[index];
            this.formItem = {
                teachername: this.current.teachername,
                pwd: this.current.pwd,
                college: this.current.college,
                classrange: [],
                email: this.current.email
            };
            this.classlist = this.current.classrange.split(',');
            
        },
        stringToArray(str) {
            return str.replace(/\[|\]/g, '').split(',');
        },
        // 获取所有班级
        getClassNum() {
             this.$http.get(this.$api.classes)
            .then(res => {
                if(res.status == '200'){
                    this.classList = res.data;

                    this.getData();
                } else {
                    this.$Message.error('操作失败！');
                }
            });
        },
        // 获取申请记录
        getData() {
            this.$http.get(this.$api.teaList)
            .then(res => {
                if(res.status === '200'){
                    this.tableData = res.data;
                    this.tableData.forEach(i => {
                        let classranges = this.stringToArray(i.classrange);
                        let classNums = [];
                        let classtext = '';
                        classranges.forEach(e => {
                            this.classList.forEach(k => {
                               if(k.id == e){
                                   classNums.push(k.classnum);
                                   if (classtext == '') {
                                        classtext = k.classnum;
                                   } else {
                                        classtext = classtext + ',' + k.classnum;
                                   }
                               }
                            });
                        });
                        i.classrange = classtext;
                    })
                } 
            })
        }
    },
    mounted(){
        this.getClassNum();
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
        Button {
            margin-right: 5px;
            margin-bottom: 10px;
        }
    }
    Table {
        width: 100%;
    }
    
</style>
