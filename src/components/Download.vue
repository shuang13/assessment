<template>
    <div class="download">
        <div class="inner-box">
            <div class="op-header">
                <download-excel
                    class = "export-excel-wrapper"
                    :data = "json_data"
                    :fields = "json_fields"
                    :name = "filename"
                    >
                    <Button type="primary">下载结果</Button>
                </download-excel>
            </div>
            <Tabs :animated="false" v-model="classnum" @on-click="selectClass">
                <TabPane :label="item.classnum" :name="item.classnum" v-for="item in classList" :key="index">
                </TabPane>
            </Tabs>
            <Table ref="selection" height="420" :columns="th" :data="tableData"></Table>
            
        </div>
    </div>
</template>
<script>
export default {
    name:'download',
    
    data() {
        return {
            // 导出excel表配置
            filename: 'filename.xls',
            json_fields: {
                "学号": "stuId",    //常规字段
                "姓名": "stuName",    //常规字段
                "总分": "totalScores",    //常规字段
            },
            index: 0,
            json_data: [],
            json_meta: [
                [
                  {
                    " key ": " charset ",
                    " value ": " utf- 8 "
                  }
                ]
            ],
            jsonData: [],

            classnum: '', //当前选择的班级代号
            // 必须事先放入空对象，不然active-name失效
            classList: [{
                classnum: '加载中...'
            }],
            th: [
                {
                    title: '年级',
                    key: 'grade'
                },
                {
                    title: '班级',
                    key: 'class'
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
                    title: '性别',
                    key: 'gender'
                },
                {
                    title: '总分',
                    key: 'totalScores'
                }
            ],
            // 表格最终显示的数据
            tableData: [],
           
        }
    },
    methods: {
        selectClass() {
            this.filename = this.classnum + '.xls';
            this.$http.get(this.$api.classStu, {classnum: this.classnum.toString()})
            .then(res => {
                if(res.status == '200'){
                    this.stuList = res.data;
                    this.tableData.splice(0, this.tableData.length); // 清空
                    for(let i = 0; i < this.stuList.length; i++) {
                        this.tableData.push({
                            stuId: this.stuList[i].stuid, //学生学号
                            stuName: this.stuList[i].stuname, //学生名字
                            totalScores: this.stuList[i].totalscores, //学生总分
                            class: this.stuList[i].classz,
                            gender: this.stuList[i].gender,
                            grade: this.stuList[i].grade,
                        }); 
                    }
                    this.json_data = this.tableData;

                } else {
                    this.$Message.error('操作失败！');
                }
            })
        },
        // 获取班级列表
        getData() {
            this.$http.get(this.$api.classes)
            .then(res => {
                if(res.status == '200'){
                    let data = res.data;
                    this.classList = data;
                    this.classnum = this.classList[0].classnum.toString();
                    this.selectClass();

                } else {
                    this.$Message.error('操作失败！');
                }
            });
        }
    },
    mounted(){
        // 当前菜单展开
        this.$parent.openName = ['2'];
        this.getData()
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
