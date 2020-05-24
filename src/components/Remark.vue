<template>
    <div class="remark">
        <div class="inner-box">
            <div class="op-header">
                <Select v-model="stuSelect" filterable style="width: 160px;" placeholder="查看班级学生" @on-change="handleFilter">
                    <Option value="">全班学生</Option>
                    <Option v-for="item in stuList" :value="item.stuid" :key="item.stuid">{{ item.stuname }} ({{ item.stuid }})</Option>
                </Select>
                
                <Modal
                    width="360"
                    title="上传测评材料"
                    >
                    <Form v-model="formItem" :label-width="80">
                        <FormItem label="测评加分项">
                            <ScoreRule ref="ScoreRule" @scoreChange="scoreChangeHandle"></ScoreRule>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal
                    width="360"
                    v-model="remarkModal"
                    title="填写备注"
                    @on-ok="updateRemake"
                    >
                    <Form :label-width="80">
                        <FormItem label="备注说明">
                            <Input v-model="remarkInput" type="textarea" placeholder="Enter something..."/>
                        </FormItem>
                    </Form>
                </Modal>
                <div class="pack-btn">
                    <Tooltip content="请多选后，进行批量操作" placement="top-end">
                        <Button type="primary" @click="handlePackPass">批量通过</Button>
                    </Tooltip>
                    <Tooltip content="请多选后，进行批量操作" placement="top-end">
                        <Button type="error" @click="handlePackUnpass">批量不通过</Button>
                    </Tooltip>
                </div>
                <div class="table-filter">
                    <CheckboxGroup v-model="filterItem" @on-change="handleFilter">
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
            <Table ref="selection" height="420" :columns="th" :data="tableData" @on-selection-change="handleRowChange"></Table>
            <div class="foot-bar">
                <div class="foot-left">
                    <span>已上传项：{{ tableData.length }}</span>
                    <span>已通过项：{{ statusNum[1] }}</span>
                    <span>未通过项：{{ statusNum[0] }}</span>
                    <span>待审核项：{{ statusNum[2] }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'remark',
    
    data() {
        return {
            classnum: '', //当前选择的班级代号
            stuSelect: '', //当前选择学生的学号
            calssSelectName: '1-1',
            // 必须事先放入空对象，不然active-name失效
            classList: [{
                classnum: '加载中...'
            }],
            stuList: [{
                stuname: '',
                stuid: '加载中...',
            }],
            filterItem: ['0', '1', '2'], //筛选展示
            statusNum: [0, 0, 0], //状态统计0---不通过 1---通过 2---待审核 
            formItem: '',
            remarkModal: false,
            remarkInput: '', //备注说明
            remakeId: '',
            stuId: '', //学号
            stuName: '', //姓名
            totalScores: 0, //实际认证总分
            selfScores: 0, //自我认证总分
            th: [{
                    type: 'selection',
                    width: 35,
                    align: 'center',
                },
                {
                    title: '学号',
                    key: 'stuId'
                },
                {
                    title: '姓名',
                    key: 'stuName'
                },
                {
                    title: '名称',
                    key: 'prizeName'
                },
                {
                    title: '加分项',
                    key: 'prizeClass'
                },
                {
                    title: '分数',
                    key: 'score'
                },
                {
                    title: '证明材料',
                    key: 'materialUrl',
                    render: (h, params) => {
                        return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'

                                },
                                on: {
                                    click: (e, index) => {
                                        let data = new FormData();
                                        data.append('fileName', params.row.materialUrl);
                                        // 后台缺少更新备注接口
                                        this.$http.getFile(this.$api.download, {fileName: params.row.materialUrl},{responseType: 'blob'})
                                        .then(res => {
                                            let blob = new Blob([res], {type: "application/pdf;charset=UTF-8"});
                                            let downElement = document.createElement('a');
                                            let href = window.URL.createObjectURL(blob);
                                            downElement.href = href;
                                            downElement.download = params.row.materialUrl;
                                            document.body.appendChild(downElement);
                                            downElement.click();
                                            document.body.removeChild(downElement);
                                            window.URL.revokeObjectURL(href);
                                            if(res.status === '200'){
                                                this.$Message.error('操作成功！');
                                            } else {
                                                this.$Message.error('操作失败！');
                                            }
                                        });
                                    }
                                }
                            }, '下载');
                    }
                },
                {
                    title: '学生备注',
                    key: 'stuRemark'
                },
                {
                    title: '审核人备注',
                    key: 'verRemark'
                },
                {
                    title: '审核状态',
                    key: 'status'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 190,
                    render: (h, params) => {
                            return h('div', [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'

                                },
                                domProps:{
                                    id: 'rePass' + params.row.prizeId 
                                },
                                style: {
                                    display: (function(){
                                        if(!params.row._disabled) {
                                            return 'none';
                                        } else {
                                            return 'inline-block';
                                        }
                                    })(),
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handlePass(params.index, 2);
                                        this.$nextTick(()=>{ 
                                            var btn = document.getElementById('rePass' + params.row.prizeId)
                                            if (params.row._disabled) {
                                                btn.style.display = 'none';
                                            } else {
                                                btn.style.display = 'inline-block';
                                            }
                                        })
                                        
                                    }
                                }
                            }, '重审'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'

                                },
                                domProps:{
                                    id: 'pass' + params.row.prizeId 
                                },
                                style: {
                                    display: (function(){
                                        if(params.row._disabled) {
                                            return 'none';
                                        } else {
                                            return 'inline-block';
                                        }
                                    })(),
                                    marginRight: '5px'

                                },
                                on: {
                                    click: () => {
                                        this.handlePass(params.index, 1);
                                        this.$nextTick(()=>{ 
                                            var btn = document.getElementById('pass' + params.row.prizeId)
                                            if (params.row._disabled) {
                                                btn.style.display = 'none';
                                            } else {
                                                btn.style.display = 'inline-block';
                                            }
                                        })
                                    }
                                }
                            }, '通过'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'

                                },
                                domProps:{
                                    id: 'unPass' + params.row.prizeId 
                                },
                                style: {
                                    display: (function(){
                                        if(params.row._disabled) {
                                            return 'none';
                                        } else {
                                            return 'inline-block';
                                        }
                                    })(),
                                    marginRight: '5px'

                                },
                                on: {
                                    click: () => {
                                        this.handlePass(params.index, 0);
                                        this.$nextTick(()=>{ 
                                            var btn = document.getElementById('unPass' + params.row.prizeId)
                                            if (params.row._disabled) {
                                                btn.style.display = 'none';
                                            } else {
                                                btn.style.display = 'inline-block';
                                            }
                                        })
                                        
                                    }
                                }
                            }, '不通过'),
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'

                                },
                                domProps:{
                                    id: 'remake' + params.row.prizeId 
                                },
                                style: {
                                    marginRight: '5px'

                                },
                                on: {
                                    click: () => {
                                        this.handleRemake(params.index);
                                    }
                                }
                            }, '备注')
                        ]);
                    }
                }
            ],
            // 奖项原始数据
            prizeInfos: [], 
            // 奖项文本数据
            prizeInfosLabel: [],
            // 表格最终显示的数据
            tableData: [],
            currentRow: [], //多选项
            // 上传测评材料
            addItem: '',
        }
    },
    watch: {
        $route: {
            handler: function(val, oldVal){
                this.selectClass();
            },
            // 深度观察监听
            deep: true
        }
    },
    methods: {
        // 更新上传备注
        updateRemake() {
            let data = new FormData();
            data.append('prizeid', this.remakeId);
            data.append('verremark', this.remarkInput);
            // 后台缺少更新备注接口
            this.$http.post(this.$api.verRemark, data)
            .then(res => {
                if(res.status === '200'){
                    let data = res.data;
                    let i = this.prizeInfos.findIndex(e => e.prizeId == this.remakeId);
                    // 后台返回更新备注
                    this.prizeInfos[i].verRemark = data.remarkInput;

                    this.selectClass();
                    this.$Message.error('操作成功！');
                } else {
                    this.$Message.error('操作失败！');
                }
            });
        },
        // 备注弹窗
        handleRemake(index) {
            this.remarkModal = true;
            this.remakeId = this.tableData[index].prizeId;
            this.remarkInput = this.tableData[index].verRemark;
        },
        // 批量通过
        handlePackPass() {
            this.currentRow.forEach((k, index) => {
                this.handlePass(index, 1);
            })
        },
        // 批量不通过
        handlePackUnpass() {
            this.currentRow.forEach((k, index) => {
                this.handlePass(index, 0);
            })
        },
        // 此处审核数据量过大，需返回当前状态修改的那一条数据
        handlePass(index, statusCode) {
            let data = new FormData();
            data.append('prizeid', this.tableData[index].prizeId);
            data.append('status', statusCode);
            data.append('stuid', this.tableData[index].stuId);
            this.prizeInfos.forEach(e => {
                if(this.tableData[index].prizeId == e.prizeId) {
                    data.append('typeCode', e.prizeClass);
                }
            })
            // 审核编码转换为文字:0---不通过 1---通过 2---待审核
            this.$http.post(this.$api.status, data)
            .then(res => {
                if(res.status === '200'){
                    let i = this.prizeInfos.findIndex(e => e.prizeId == this.tableData[index].prizeId);
                    this.prizeInfos[i].status = statusCode;
                    this.prizeInfos[i]._disabled = (this.prizeInfos[i].status == 1 || this.prizeInfos[i].status == 0);
                    // 后台数据返回更新
                    // this.prizeInfos[i] = res.data;

                    // 数据格式转换
                    this.textTransform()
                    // 更新渲染数据
                    this.handleFilter();

                    this.$Message.error('操作成功！');
                } else {
                    this.$Message.error('操作失败！');
                }
            });
        },
        // 数据更新展示
        handleFilter() {
            this.totalScores = 0;
            this.selfScores = 0;
            this.statusNum = [0, 0, 0];

            this.tableData.splice(0, this.tableData.length);
            this.prizeInfosLabel.forEach((e, index) => {
                // 根据状态筛选
                if((this.filterItem.indexOf(this.prizeInfos[index].status.toString()) != -1 && e.stuId == this.stuSelect) 
                    || (this.filterItem.indexOf(this.prizeInfos[index].status.toString()) != -1 && !this.stuSelect)) {
                    // 审核编码转换为文字:0---不通过 1---通过 2---待审核 
                    if (e.status == '不通过') {
                        this.statusNum[0]++;
                    } else if(e.status == '通过') {
                        this.statusNum[1]++;
                        // 实际认证总分
                        this.totalScores += e.score;
                    } else if(e.status == '待审核 ') {
                        this.statusNum[2]++;
                    } 
    
                    // 自我认证总分
                    this.selfScores += e.score;
                    this.tableData.push(this.prizeInfosLabel[index]); 
                }
            });

        },
        selectClass() {
            // 获取选择班级学生名单
            this.stuSelect = '';
            this.prizeInfos.splice(0, this.prizeInfos.length);
            this.prizeInfosLabel.splice(0, this.prizeInfosLabel.length);
            this.tableData.splice(0, this.tableData.length);
            this.classnum = this.$route.query.classnum;
            this.$http.get(this.$api.classStu, {classnum: this.classnum.toString()})
            .then(res => {
                if(res.status === '200'){
                    let data = res.data;
                    this.stuList = data;
                    if (res.data.length == 0) {
                        return;
                    }
                    data.forEach(e => {
                        this.$http.get(this.$api.stuPrizes, {
                            stuid: e.stuid
                        })
                        .then(res => {
                            if(res.status === '200'){
                                if (res.data.length == 0) {
                                    return;
                                }
                                res.data.forEach(k => {

                                    this.prizeInfos.push({
                                        stuId: e.stuid, //学生学号
                                        stuName: e.stuname, //学生名字
                                        prizeName: k.prizename, //获奖名称
                                        prizeClass: [this.addPreZero(k.prizecategory), this.addPreZero(k.prizelevel), this.addPreZero(k.prizescore)].join(''), //获奖级别
                                        verifyDate: '', //审核日期
                                        stuRemark: k.sturemark, //学生备注
                                        verRemark: k.verremark, //审核备注
                                        status: k.prizestatus, //审核状态
                                        score: k.prizescore, //审核分数
                                        materialUrl: k.materialurl,
                                        prizeId: k.id,
                                        _disabled: k.prizestatus == 1 || k.prizestatus == 0//     多选框是否可选，私有属性不会上传到后台
                                    }); 
                                })

                                // 数据格式转换
                                this.textTransform()
                                // 根据条件筛选
                                this.handleFilter();
                            }
                        })
                    })

                    


                } else {
                    this.$Message.error('操作失败！');
                }
            })
        },
        // 数据格式转换
        textTransform() {
            this.prizeInfosLabel = JSON.parse(JSON.stringify(this.prizeInfos));

            this.prizeInfosLabel.forEach(e => {
                // 加分项编码转换为文字
                let temp = [];
                for (let i = 0; i < e.prizeClass.length - 1; i = i + 2) {
                    temp.push(e.prizeClass.split('').slice(i, i + 2).join(''));
                }
                let o = this.addItem[parseInt(temp[0]) - 1].children[parseInt(temp[1] - 1)];
                if (o.children.find(k => k.value == temp[2])) {
                    e.prizeClass = o.label + o.children.find(k => k.value == temp[2]).label;
                } else {
                    e.prizeClass = o.label;
                }

                // 审核编码转换为文字:0---不通过 1---通过 2---待审核 
                if (e.status == '0') {
                    e.status = '不通过';
                    this.statusNum[0]++;
                } else if(e.status == '1') {
                    e.status = '通过';
                    this.statusNum[1]++;
                    // 实际认证总分
                    this.totalScores += e.score;
                } else if(e.status == '2') {
                    e.status = '待审核 ';
                    this.statusNum[2]++;
                } 


                // 自我认证总分
                this.selfScores += e.score;
            });
        },
        // 获取相应项目分数
        scoreChangeHandle(val) {
            this.formItem.addscore = this.$refs.ScoreRule.val.join('');
            this.formItem.score = val[val.length - 1];

        },
        getRule() {
            this.$http.get(this.$api.rule)
            .then(res => {
                this.addItem = res;
                this.selectClass();
            })
        },
        // 获取多选项
        handleRowChange(val) {
            this.currentRow = val;
        },
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
