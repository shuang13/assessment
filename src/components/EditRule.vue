<template>
    <div class="editRule">
        <div class="inner-box">
            <div class="op-header">
                 <Row class="row">
                    <Col span="22" offset="1">
                        <Card>
                            <p slot="title">综合素质评分规则</p>
                            <Button type="warning" @click="uploadHandle">修改测评项</Button>
                            <div class="tree" ref="chartTree"></div>
                            <Modal
                                width="360"
                                v-model="uploadModal"
                                title="修改测评项分值"
                                @on-ok="ok"
                                @on-cancel="cancel">
                                <Form v-model="formItem" :label-width="80">
                                    <FormItem label="测评加分项">
                                        <ScoreRule ref="ScoreRule" v-model="formItem.typeCode"></ScoreRule>
                                    </FormItem>
                                    <FormItem label="分数">
                                        <Input v-model="formItem.score" placeholder="Enter something..."/>
                                    </FormItem>
                                </Form>
                            </Modal>
                        </Card>
                    </Col>
                </Row>
            </div>
            
            <div class="foot-bar">
                <div class="foot-left">
                    
                </div>
                <div class="foot-right">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'

export default {

    name:'editRule',
    data() {
        return {
            stuId: sessionStorage.getItem("stuId"), //学号
            stuName: '', //姓名
            uploadModal: false,
            formItem: {
                typeCode: '',
                score: 0,
            },
            addItem: [], // 评分规则
            
            // 树状图
            chartTree: null,
            // 个人奖项树
            dataTree: [
                {
                    name: "个人综合素质",
                    children: []
                }
            ],
        }
    },
    watch: {

    },
    methods: {
        getRule() {
            this.$http.get(this.$api.rule)
            .then(res => {
                this.addItem = res;
                this.initChartTree()
            })
        },
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
        uploadHandle() {
            this.uploadModal = true;
            this.$refs.ScoreRule.val = [];
            this.formItem = {
                typeCode: '',
                score: '',
            };
        },
        initChartTree() {
            this.chartTree = echarts.init(this.$refs.chartTree);
            this.dataTree[0].children = this.addItem;
            this.dataTree[0].children.forEach(e => {
                e["name"] = e.label;
                e["collapsed"] = true;
                e.children.forEach(k => {
                    k["name"] = k.label;
                    k.children.forEach(p => {
                        p["name"] = p.label + "(" + parseInt(p.value) + "分)";
                    })
                })
            })

            this.chartTree.setOption({
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                series: [
                    {
                        type: 'tree',
        
                        data: this.dataTree,
        
                        top: '1%',
                        left: '12%',
                        bottom: '1%',
                        right: '25%',
        
                        symbolSize: 7,
        
                        label: {
                            normal: {
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right',
                                fontSize: 12
                            }
                        },
        
                        leaves: {
                            label: {
                                normal: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left'
                                }
                            }
                        },
        
                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750
                    }
                ]
            })
        }
    },
    mounted(){
        this.getRule();
    },

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
        .tree {
            width: 850px;
            height: 430px;
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
