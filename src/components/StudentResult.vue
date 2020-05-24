<template>
    <div class="studentResult">
        <div class="inner-box">
            <div class="op-header">
                <Table ref="selection" :columns="th" :data="tableData"></Table>
                 <Row class="row">
                    <Col span="11">
                        <Card>
                            <p slot="title">分值统计</p>
                            <div class="pie" ref="chartPie">
                                暂无数据
                            </div>
                        </Card>
                    </Col>
                    <Col span="12" offset="1">
                        <Card>
                            <p slot="title">奖项统计</p>
                            <div class="tree" ref="chartTree">
                                暂无数据
                                
                            </div>
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

    name:'studentResult',
    data() {
        return {
            stuId: sessionStorage.getItem("stuId"), //学号
            stuName: '', //姓名
            totalScores: 0, //实际认证总分
            selfScores: 0, //自我认证总分
            prizeInfos: [], // 奖项原始数据
            addItem: [], // 评分规则
            myPrize: [
            {
                "label": "科技竞赛",
                "score": 0,
                "children": []
            }, {
                "label": "学术论文",
                "score": 0,
                "children": []
            }, {
                "label": "创新创业",
                "score": 0,
                "children": []
            }, {
                "label": "科研训练",
                "score": 0,
                "children": []
            }, {
                "label": "社会实践",
                "score": 0,
                "children": []
            }, {
                "label": "文化艺术",
                "score": 0,
                "children": []
            }, {
                "label": "健康运动",
                "score": 0,
                "children": []
            }, {
                "label": "技能认证",
                "score": 0,
                "children": []
            }, {
                "label": "特殊加分",
                "score": 0,
                "children": []
            }],
            th: [{
                    title: '总分',
                    key: 'score'
                }
            ],
            // 表格数据
            tableData: [
            ],
            // 饼状图
            chartPie: null,
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
        // 获取申请记录
        getData() {
            this.$http.get(this.$api.stuPrizes, {
                stuid: this.stuId
            })
            .then(res => {
                if(res.status === '200'){
                    if (res.data.length == 0) {
                        return;
                    }
                    let data = res.data;

                    this.prizeInfos.splice(0, this.prizeInfos.length);
                    data.forEach(e => {
                        // 根据状态筛选
                        if(e.prizestatus == 1) {
                            this.prizeInfos.push({
                                id: e.id,
                                prizename: e.prizename,
                                prizeClass: this.addPreZero(e.prizecategory) + this.addPreZero(e.prizelevel) + this.addPreZero(e.prizescore),
                                score: e.prizescore,
                                status: e.prizestatus,
                                verifyDate: '',
                                sturemark: e.sturemark,
                                verremark: e.verremark,
                            }); 
    
                        }
                    });

                    this.pushPrize();
                }
            })
        },
        getStuinfo() {
            this.$http.get(this.$api.stuInfo, {stuid: this.stuId})
            .then(res => {
                this.totalScores = res.data.totalscores;
                this.getData();

            })
        },
        getRule() {
            this.$http.get(this.$api.rule)
            .then(res => {
                this.addItem = res;
                this.getStuinfo()
            })
        },

        pushPrize() {

            this.prizeInfos.forEach(e => {
                let temp = [];
                for (let i = 0; i < e.prizeClass.length - 1; i = i + 2) {
                    temp.push(parseInt(e.prizeClass.split('').slice(i, i + 2).join('')));
                }
                let o = this.addItem[temp[0] - 1].children[temp[1] - 1];
                if (o.children.find(k => k.value == temp[2])) {
                    e.prizeClass = o.children.find(k => k.value == temp[2]).__label;
                } else {
                    e.prizeClass = o.label;
                }

                
                let prizeClass = e.prizeClass.split(' / ');
                prizeClass[2] = e.prizename + '('+ e.score +'分)';

                let flag1 = false;
                let flag2 = false;
                for(var i = 0; i < this.dataTree[0].children.length; i++) {
                    if(this.dataTree[0].children[i].name == prizeClass[0]) {
                        flag1 = true;
                        flag2 = false;
                        for(var j = 0; j < this.dataTree[0].children[i].children.length; j++) {
                            if (this.dataTree[0].children[i].children[j] == prizeClass[1]) {
                                flag2 = true;
                                this.dataTree[0].children[i].children[j].push({
                                    name: prizeClass[2],
                                    score: e.score
                                })
                                break;
                            }
                        }
                        break;
                    }

                }
                if(!(flag1 || flag2)) {
                    this.dataTree[0].children.push({
                        name: prizeClass[0],
                        children: [{
                            name: prizeClass[1],
                            children: [{
                                name: prizeClass[2],
                                score: e.score
                            }]
                        }]
                    })
                }
                if(flag1 == true && flag2 == false) {
                    this.dataTree[0].children[i].children.push({
                        name: prizeClass[1],
                        children: [{
                            name: prizeClass[2],
                            score: e.score
                        }]
                    })
                }
                
                this.myPrize[temp[0] - 1].children.push(e);
                this.myPrize[temp[0] - 1].score = this.myPrize[temp[0] - 1].score + e.score;



            })
            let p = {
                score: this.totalScores
            };

            this.myPrize.forEach((e, index) => {
                let keys = "score" + index;
                this.th.push({
                    title: e.label,
                    key: keys
                })
                p[keys] = e.score;
            })
            // 渲染表格与图表
            this.tableData.push(p);
            this.initChartPie();
            this.initChartTree();
            
        },
        initChartPie() {
            this.chartPie = echarts.init(this.$refs.chartPie);
            // 把配置和数据放这里
            let data = {
                legendData: [],
                seriesData: [],

            }
            this.myPrize.forEach(e => {
                if(e.score != 0) {
                    data.legendData.push(e.label);
                    data.seriesData.push({
                        name: e.label,
                        value: e.score
                    })
                };
            })
            this.chartPie.setOption({
                title : {
                    text: '综合素质分值统计',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: data.legendData,
                },
                series : [
                    {
                        name: '分值',
                        type: 'pie',
                        radius : '55%',
                        center: ['40%', '50%'],
                        data: data.seriesData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        },
        initChartTree() {
            this.chartTree = echarts.init(this.$refs.chartTree);

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
                                fontSize: 9
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
        },
        // 工具
        addPreZero(num){
            if(num < 10){
                return '0' + num;
            }else{
                return '' + num;
            }
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
        padding: 20px 20px 0 20px;
        .row {
            margin-top: 20px;
        }
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
        .pie {
            width: 450px;
            height: 300px;
        }
        .tree {
            width: 550px;
            height: 300px;
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
