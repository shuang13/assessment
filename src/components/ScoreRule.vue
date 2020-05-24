<template>
     <Cascader v-model="val" :data="addItem" trigger="hover"></Cascader>
</template>
<script>
    export default {
        data () {
            return {
                // 测评规则
                val: [],
                addItem: []
            }
        },
        methods: {
            
        },
        watch: {
            // 向父组件传变动值
            val(newVal) {
                this.$emit('scoreChange', newVal);
            }
        },
        mounted(){
            this.$http.get(this.$api.rule)
            .then(res => {
                this.addItem = res;
                
            })
        }

    }
</script>
<style lang="less">

</style>
