<template>
    <!-- 当前在线人数版本设置 -->
    <div class="app-container Current-online-population-version">
        <div class="lottery-type-head">
            <p>当前在线人数版本名称：</p>
            <p>
                <el-select v-model="SelectTheVersionID" placeholder="请选择" @change="SelectTheVersion">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </p>
            <p><el-input disabled="disabled" v-model="visonName" style="width:850px;" placeholder="请输入内容"></el-input></p>
        </div>
        <div class="lottery-type-content">
            <!-- 遮挡滚动条 -->
            <div class="cover-scrollbar"></div>
            <!-- 彩种类型树 -->
            <div class="lottery-type-tree">
                <el-tree
                    class="filter-tree"
                    :data="tempLotteryType"
                    :props="defaultProps"
                    default-expand-all
                    ref="tree2"
                    @node-click="handleNodeClick"
                    :render-content="renderContent"
                    v-loading="loadingObj.LoadingTree">
                </el-tree>
            </div>
            <!-- 对应类型赔率详情 -->
            <div class="lottery-type-odd-box">
                <div class="lottery-type-state">
                    <span>一级彩种名称：{{ parentName }}</span>    
                    <span>二级彩种名称：{{ childName }}</span>    
                </div>
                <div class="lottery-type-option-box">
                    <div class="pencent-content" >
                        <configContent :isConfig="isConfig" :lotteryId="currentLotteryId" :parId="id" :thisLottery="titleName"></configContent>
                    </div> 
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { visonDrapDown } from '@/api/agentPlatForm/systemManage/ag_configOnlinePeople'
import { lotteryTree,findByLotteryId,visonNamelist } from '@/api/agentPlatForm/systemManage/ag_sm_userdefine_limit'
import { validNinedatayi } from '@/utils/validate'
import configContent from '../../lotteryCore/lc_info/onlinePeopleData'
export default {
    data() {
        return {
            hideScrollBar: true,
            edit_View_Details:{
                titleName:"查看详情"
            },
            SelectTheVersionID:"", // 版本ID
            loadingObj:{
                LoadingTree:false,
                LoadingTable:false,
            },
            defaultProps: { 
                children: 'children',
                label: 'label'
            },
            tempLotteryType: [], // 临时树结构数据
            seriesName: '', // 彩种系列名称
            parentName:"香港彩",
            childName: '香港六合彩', // 对应彩种名称（默认为香港六合彩）
            currentLotteryId: '8', // 当前彩种id（默认为香港六合彩id）
            saveBtnUsable: true, // 保存按钮是否可用
            isValidate: true, // 是否通过校验可以保存
            visonNum:"",
            options:[], // 版本名称下拉
            visonName:"",
        }
    },
    props:[
        'id',
        'titleName',
        'isConfig'
    ],
    components: {
        configContent
    },
    computed: {
        ...mapState({
            bet_data_common: state => state.ag_userdefine_bet.bet_data_common,
            // currentBetType: state => state.ag_userdefine_bet.currentBetType, // 当前投注上限类型
            isEdit: state => state.ag_userdefine_bet.isEdit
        }),
    },
    methods: {
        SelectTheVersion(val){
         
           this.$store.state.ag_userdefine_bet.bet_data_common = []
           this.loadingObj.LoadingTable = true;
           this.getList("8");
           this.visonName = this.setVison(val);
        },
        handleNodeClick(data,node,store) { // 点击树节点方法(彩种切换)
          //  this.$slots.state.ag_userdefine_bet.bet_data_common.detailList = [];
            this.parentName = node.parent.data.name;
            this.childName = data.name;
            this.saveBtnUsable = true; // 每次切换彩种保存按钮置为不可用状态
            this.currentLotteryId = data.id; // 当前彩种Id
            this.$store.state.ag_configOnlinePeople.configLoteryId = this.currentLotteryId;
            if(data.id == "8"){  // 点击香港彩 通用盘口限制配置 增加对应的眉头样式
                this.$store.commit('SET_PADDING_16',true)
            }else{
                this.$store.commit('SET_PADDING_16',false)
            }
        },
        renderContent(h,{ node,data,store}) { // 自定义节点内容
            if(data.category != undefined) {
                if(data.category == 1) {
                    return (
                        // <span><i style="color:green;font-style:normal;">【自】</i>{data.name}</span>
                        <span><i style="color:green;font-style:normal;"></i>{data.name}</span>
                    )
                }else if(data.category == 0) {
                    if(node.childNodes.length == 0) {
                        return (
                            // <span><i style="color:red;font-style:normal;">【通】</i>{data.name}</span>
                            <span><i style="color:red;font-style:normal;"></i>{data.name}</span>
                        )
                    }
                }
            }else {
                return (
                    <span>{data.name}</span>
                )
            }
        },
        getList(val){
            if(val == "8"){  // 点击香港彩 通用盘口限制配置 增加对应的眉头样式
                this.$store.commit('SET_PADDING_16',true)
            }else{
                this.$store.commit('SET_PADDING_16',false)
            }
            let category = ''; // 临时保存香港六合彩  投注上限类型
            this.loadingObj.LoadingTree = true;

            lotteryTree().then(res => { // 彩种树初始化
                let resData = res.data
                category = resData.content[0].children[0].category // 香港六合彩 赔率类型
                this.currentCheckBetType = category ? '自定义设置' : '通用设置'
                if(this.currentCheckBetType == '自定义设置') {
                    this.isStartAble = false;
                }else {
                    this.isStartAble = true;
                }
                if(resData.success == 1) {
                    this.tempLotteryType = resData.content;
                
                }else {
                    this.$message.error(resData.respMsg);
                }
                this.loadingObj.LoadingTree = false;
                this.currentLotteryId = '8';
                this.parentName = "香港彩";
                this.childName = '香港六合彩';
            })
        },
        setVison(val){ // 版本ID转为name
            let itme = ""
            this.options.forEach(element => {
                if(element.id == val){
                    itme = element.name;
                }
            });  
            return itme;
        }
    },
    mounted() {
        if(this.isConfig == 1){
            visonDrapDown().then(res => {
                if(res.data.success == 1){
                    this.options = res.data.content;
                    this.visonName = this.setVison(this.id);
                }else{
                    this.$message.error(res.data.respMsg)
                }
            })
        }
         
        this.getList("8")
        this.SelectTheVersionID =  this.id;   
    },
}
</script>
<style lang="scss" >
.Current-online-population-version {
    .lottery-type-head{
        width: 100%;
        display: flex;
        flex-direction: row;
        p:nth-child(2){
            width: 80px;
            margin-right: 48px;
            .el-input{
                width: 110px!important;
            }
        }
        p:nth-child(3){
            width: 480px;
        }
        
    }
    .lottery-type-content{
        position: relative;
        display: flex;
        flex-direction: row;
        .cover-scrollbar {
            left: 198px;
            max-height: 498px;
            top: -1px;
        }
    }
    .lottery-type-tree {
        width: 215px;
        overflow: auto;
        max-height: 498px;
        // min-height: calc(56vh - 7px);
        border: 1px solid #dcdfe6;
    }
    .lottery-type-odd-box {
        width: 78%;
        max-width: 990px;
        margin-left: 20px;
        .lottery-type-state {
            line-height: 40px;
            padding-left: 20px;
            font-size: 14px;
            border: 1px solid #dcdfe6;
            span{
                margin-right: 30px;
            }
        }
    }
    .lottery-type-option-box {
        position: relative;
        .blue-font {
            color: blue;
            font-style: normal;
        }
        .odd-state-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .common-odd,.userdefine-odd {
                line-height: 40px;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
            .common-odd {
                width: 40%;
            }
            .userdefine-odd {
                width: 58%;
            }
        }
        // .odd-detail-box {
        //     margin-top: 10px;
        //     padding: 20px;
        //     max-height: calc(100vh - 300px);
        //     width: 100%;
        //     // overflow-y: auto;
             
        // }
        .set-bet-box {
            position: absolute;
            right: 0;
            bottom:10px;
            width: 100%;
            text-align: right;
            padding-right: 20px;
            background: #fff;
        }
    }
    
}
</style>


