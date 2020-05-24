<template>
    <div class="studentUpload">
        <div class="inner-box">
            <div class="op-header">
                <Button type="warning" @click="uploadHandle">上传材料</Button>
                <Modal
                    width="360"
                    v-model="uploadModal"
                    title="上传测评材料"
                    @on-ok="ok"
                    @on-cancel="cancel">
                    <Form v-model="formItem" :label-width="80">
                        <FormItem label="测评项名称">
                            <Input v-model="formItem.prizename" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem label="测评加分项">
                            <ScoreRule ref="ScoreRule" @scoreChange="scoreChangeHandle"></ScoreRule>
                        </FormItem>
                        <FormItem label="分数">
                            <Input v-model="score" placeholder="Enter something..."/>
                        </FormItem>
                        <FormItem label="证明材料">
                            <Upload ref="fileNode" action="/nmid/uploadFile" :before-upload="handleUploadFile">
                                <Button icon="ios-cloud-upload-outline">文件上传</Button>
                            </Upload>
                        </FormItem>
                        <FormItem label="备注说明">
                            <Input v-model="formItem.sturemark" type="textarea" placeholder="Enter something..."/>
                        </FormItem>
                    </Form>
                </Modal>
                <Button type="error" @click="handleDelete">批量删除</Button>
                <div class="table-filter">
                    <CheckboxGroup v-model="filterItem" @on-change="getData">
                        <Checkbox label="1">
                            <span>已通过</span>
                        </Checkbox>
                        <Checkbox label="0">
                            <span>未通过</span>
                        </Checkbox>
                        <Checkbox label="2">
                            <span>待审核</span>
                        </Checkbox>
                    </CheckboxGroup>
                </div>
            </div>
            <Table ref="selection" height="420" :columns="th" :data="prizeInfosLabel" @on-selection-change="handleRowChange"></Table>
            <div class="foot-bar">
                <div class="foot-left">
                    <span>已上传项：{{ prizeInfos.length }}</span>
                    <span>已通过项：{{ statusNum[1] }}</span>
                    <span>未通过项：{{ statusNum[0] }}</span>
                    <span>待审核项：{{ statusNum[2] }}</span>
                </div>
                <div class="foot-right">
                    <span>自我认证分数合计：{{ selfScores }}</span>
                    <span>实际认证分数合计：{{ totalScores }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'StudentUpload',
    data() {
        return {
            stuid: sessionStorage.getItem("stuId"), //学号
            stuName: '', //姓名
            totalScores: '', //实际认证总分
            selfScores: 0, //自我认证总分

            filterItem: ['0', '1', '2'], //筛选展示
            statusNum: [0, 0, 0], //状态统计0---不通过 1---通过 2---待审核

      
            uploadModal: false, //上传弹窗

            th: [{
                    type: 'selection',
                    width: 35,
                    align: 'center',
                },
                {
                    title: '名称',
                    key: 'prizename'
                },
                {
                    title: '加分项',
                    key: 'prizecategory'
                },
                {
                    title: '分数',
                    key: 'score'
                },
                {
                    title: '审核情况',
                    key: 'status'
                },
                {
                    title: '上传日期',
                    key: 'upDate'
                },
                // {
                //     title: '审核日期',
                //     key: 'verifyDate'
                // },
                {
                    title: '学生备注',
                    key: 'sturemark'
                },
                {
                    title: '审核人备注',
                    key: 'verRemark'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        if(!params.row._disabled) {
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
                                }, '修改')
                            ]); 
                        }
                    }
                }
            ],
            // 奖项原始数据
            prizeInfos: [], 
            // 奖项文本数据
            prizeInfosLabel: [],
            //多选项
            currentRow: [], 
            delPrize: [],
            // 上传测评材料
            formItem: {
                stuid: this.stuid,
                prizename: '',
                typeCode: '',
                materialurl: '',
                sturemark: ''
            },
            score: 0,
            // 修改弹窗标志
            modifyFlag: false,

            addItem: [],

        }
    },
    watch: {

    },
    methods: {
        // 获取申请记录
        getData() {

            this.$http.get(this.$api.stuPrizes, {
                stuid: this.stuid
            })
            .then(res => {
                if(res.status === '200'){
                    if (res.data.length == 0) {
                        return;
                    }
                    let data = res.data;
                    this.stuName = res.stuName;

                    // 实际认证总分
                    // this.totalScores = data.totalScores;
                    
                    this.prizeInfos.splice(0, this.prizeInfos.length);
                    data.forEach(e => {
                        // 根据状态筛选
                        if(this.filterItem.indexOf(e.prizestatus.toString()) != -1) {
                            this.prizeInfos.push({
                                id: e.id,
                                prizename: e.prizename,
                                prizecategory: e.prizecategory,
                                prizelevel: e.prizelevel,
                                score: e.prizescore,
                                status: e.prizestatus,
                                upDate: this.getLocalTime(e.lastupdate),
                                verifyDate: '',
                                sturemark: e.sturemark,
                                verremark: e.verremark,
                                _disabled: e.prizestatus == 1
                            }); 
    
                        }
                    });
                     // 数据格式转换
                    this.textTransform()
                } 
            })
        },
        ok () {
            if (this.modifyFlag) {
                let data = new FormData();
                data.append('prizeinfo', JSON.stringify(this.formItem));
                this.$http.post(this.$api.update, data)
                .then(res => {
                    if(res.status === '200'){
                        this.$Message.error('操作成功！');
                    } else {
                        this.$Message.error('操作失败！');
                    }
                    this.getData();
                })
            } else {
                let data = new FormData();
                data.append('prizeinfo', JSON.stringify(this.formItem));
                this.$http.post(this.$api.upload, data)
                .then(res => {
                    if(res.status === '200'){
                        this.$Message.error('操作成功！');
                    } else {
                        this.$Message.error('操作失败！');
                    }
                    this.getData();
                })
            }
            
            this.$Message.info('Clicked ok');
        },
        cancel () {
            this.$Message.info('Clicked cancel');
        },
        // 批量删除申请
        handleDelete() {
            let data = new FormData();
            data.append('prizeIds', this.delPrize);
            this.$http.post(this.$api.delPrize, data)
            .then(res => {
                if(res.status === '200'){
                    this.$Message.error('操作成功！');
                } else {
                    this.$Message.error('操作失败！');
                }
                this.getData();
            })    
        },
        getRule() {
            this.$http.get(this.$api.rule)
            .then(res => {
                this.addItem = res;
                this.getData();
            })
        },
        // 获取相应项目分数
        scoreChangeHandle(val) {
            this.formItem.typeCode = this.$refs.ScoreRule.val.join('');
            this.score = parseInt(val[val.length - 1]);

        },
        // 获取多选项
        handleRowChange(val) {
            this.currentRow = val;
            this.currentRow.forEach(e=> {
                this.delPrize.push(e.id);
            })

        },
        // 文件地址
        handleUploadFile(file) {
            this.formItem.materialurl = file.name;
        },
        // 上传
        uploadHandle() {
            this.uploadModal = true;
            this.$refs.ScoreRule.val = [];
            this.score = 0;
            this.formItem = {
                stuid: this.stuid,
                prizename: '',
                typeCode: '',
                materialurl: '',
                sturemark: ''
            };
            this.$refs.fileNode.clearFiles();

        },
        // 修改
        handleModify(index) {
            this.uploadModal = true;
            this.modifyFlag = true;
            let current = this.prizeInfos[index];
            let temp = [this.addPreZero(current.prizecategory), this.addPreZero(current.prizelevel), this.addPreZero(current.score)];
            this.formItem = {
                stuid: this.stuid,
                prizename: current.prizename,
                typeCode: '',
                materialurl: '',
                sturemark: current.sturemark
            };
            this.$refs.ScoreRule.val = temp;

            this.formItem.typeCode = temp.join('');
            
            this.$refs.fileNode.clearFiles();



        },
        // 格式转换
        textTransform() {
            this.totalScores = 0;
            this.selfScores = 0;
            this.prizeInfosLabel = JSON.parse(JSON.stringify(this.prizeInfos));
            this.prizeInfosLabel.forEach(e => {
                // 加分项编码转换为文字
                
                let o = this.addItem[e.prizecategory - 1].children[e.prizelevel - 1];
                if (o.children.find(k => k.value == e.score)) {
                    e.prizecategory = o.label + o.children.find(k => k.value == e.score).label;
                } else {
                    e.prizecategory = o.label;
                }
                // 审核编码转换为文字:0---不通过 1---通过 2---待审核 3---已上传
                if (e.status == '0') {
                    e.status = '不通过';
                    this.statusNum[0]++;
                } else if(e.status == '1') {
                    e.status = '通过';
                    this.statusNum[1]++;
                    // 实际认证总分
                    this.totalScores  += e.score;
                } else if(e.status == '2') {
                    e.status = '待审核 ';
                    this.statusNum[2]++;
                } 
                // 自我认证总分
                this.selfScores += e.score;
            })
        },

        // 工具
        addPreZero(num){
            if(num < 10){
                return '0' + num;
            }else{
                return '' + num;
            }
        },
        getLocalTime(date) {     
            var dateee = new Date(date).toJSON();
            return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }
    },
    mounted(){
        this.getRule();

    }
}
</script>
<style lang="less">
    .inner-box {
        position: relative;
        height: 550px;
        border-radius: 4px;
        background: #fff;
    }
    .op-header {
        padding: 20px 20px 0 20px;
        Button {
            margin-right: 5px;
        }
        .table-filter {
            height: 40px;
            line-height: 40px;
        }
        .pack-btn {
            float: right;
            margin-top: 30px;
        }
    }
    Table {
        width: 100%;
    }
    .foot-bar {
        padding: 0 20px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        overflow: hidden;
        .foot-left {
            float: left;
            span {
                margin-right: 15px;
            }
        }
        .foot-right {
            float: right;
        }
    }
</style>
