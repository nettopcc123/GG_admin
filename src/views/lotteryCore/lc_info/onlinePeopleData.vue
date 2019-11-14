<template>
  <div>
    <div class="data-head">
      <div class="btnGroup" v-if="thisLottery == '编辑赔率' || thisLottery == '设置人数' ? true:false">
        <el-button type="primary" size="mini" @click="isDisable = false;">
          <svg-icon icon-class="bianji" />
            启用编辑</el-button> 
        <el-button type="primary" size="mini" @click="save" :loading="saveLoad">
            <svg-icon v-if="saveLoad == false" icon-class="baocun" />
            保存</el-button>
        
      </div>
    </div>
    <div class="people-data-list" >
      <!-- 遮挡滚动条 -->
      <div  class="cover-scrollbar"></div>
      <div class="people-data-head">
        <p style="margin: 0px 186px 0px 21px;" class="people-data-head-p">展示时间</p>
        <p>在线人数</p>
      </div>
      <div class="people-data-content" v-loading="loading">
        <ul>
          <li v-for="(item,index) in listArr" :key="index">
            <span>{{item.time}}</span>
            <span>
              <el-input placeholder="请输入内容" v-model="item.minNum" :disabled="isDisable"> </el-input>
              <em>至</em>
              <el-input placeholder="请输入内容" v-model="item.maxNum" :disabled="isDisable" > </el-input>
            </span>
          </li>
        </ul>
      </div>
     
    </div>
     <el-button class="close"  size="mini" style="margin-top: 10px;" @click="closeDetail">
            关闭</el-button>
  </div>
</template>
<script>
import { saveConfig,configOnlinePeople } from '@/api/lotteryCore/lc_info/lc_showPeopleOnline'
import { checkDetail } from '../../../api/agentPlatForm/systemManage/ag_configOnlinePeople'
import {valid_seven_data} from '@/utils/validate'
import { debounce } from '../../../utils';
export default {
  props:["thisLottery","parId","isConfig",'lotteryId','witchPage'],
  data(){
    return{
      isDisable:true,
      listArr:[],
      minNum:0,
      maxNum:0,
      loading:false,
      saveLoad:false,
    }
  },
  created(){
    
    this.getPeopleData();
  },
  watch:{
    lotteryId(newVal,oldVal){
      if(newVal != oldVal){
        this.lotteryId = newVal;
        this.getPeopleData()
      }
    }
  },
  methods:{
    getPeopleData(){ // 请求弹框数据
      this.loading = true;
    // 在线人数设置与在线人数展示管理都要展示这个页面，所以用传值来判断是哪个页面进入的，然后请求相对应的接口，并展示
      if(this.witchPage){ 
        configOnlinePeople({id:this.parId,lotteryId:this.lotteryId}).then(res =>{
          if(res.data.success == 1){
            this.listArr = res.data.content;
          }
          this.loading = false;
        })
      }else{
        checkDetail({id:this.parId,lotteryId:this.lotteryId}).then(res =>{
          if(res.data.success == 1){
            this.listArr = res.data.content.onlineConfig;
          }
          this.loading = false;
        })
      }
      
    },
    save(val){ // 保存编辑
      if(this.isDisable == true){
        this.$message.warning("请编辑后再保存");
        return false;
      }
      let peoples = [];
      
      for (let i = 0; i < this.listArr.length; i++) {  // 组合请求参数
       if(!valid_seven_data(this.listArr[i].maxNum)||!valid_seven_data(this.listArr[i].minNum)){ // 1-1000000的正整数
          this.$message.warning('请输入1-1000000的正整数');
          return
       }
       if(Number(this.listArr[i].minNum)>Number(this.listArr[i].maxNum)){
          this.$message.warning('起始人数小于等于截止人数');
          return
       }
        peoples.push({
          id:this.listArr[i].id,
          maxNum:this.listArr[i].maxNum,
          minNum:this.listArr[i].minNum,
        })
      }
      let data = {
        id:this.parId,
        configList:peoples
      };
      this.saveLoad = true;// loading打开
      saveConfig(data).then(res =>{
        if(res.data.success == 1){
          this.$message.success("保存成功");
          // this.$store.state.lc_showOnlinePeople.refeshTable = true;
          this.$emit('setlistinfo')
          this.$store.state.lc_showOnlinePeople.editPercentLotteryDialog = false; //  弹框显示与隐藏
          this.isDisable = true; // 不可编辑
        }else{
          this.$message.error(res.data.respMsg);
        } 
       this.saveLoad = false; // loading取消
      
      })
    },
    closeDetail(){ // 关闭详情
      if(this.isConfig){
        this.$store.state.ag_configOnlinePeople.checkDetailDialog = false;
      }else{
        this.$store.state.lc_showOnlinePeople.editPercentLotteryDialog = false;
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>  
  .close{
    margin-left: 90%;
    margin-bottom: 10px;
  }
  .data-head{
    height: 30px;
    .btnGroup{
      float: right;
    }
  }
  .people-data-list{
    .cover-scrollbar {
      top: 82px!important;
      right: 27px;
      left: unset !important;
      max-height: 360px!important;
    }
    padding-top: 10px;
    border: 1px solid #dcdfe6;
    .people-data-head{
      display: flex;
      flex-direction: row;
      width: 70%;
      margin-left: 21px;
      // margin: auto;
      p{
        width: 50%;
        text-align: center;
        background-color: #F5F7FA;
        border: 1px solid #dcdfe6;
        line-height: 30px;
        &:last-child{
          // margin-left: 20px;
        }
      }
    }
    .people-data-content::-webkit-scrollbar {
      display: none;
    }
    .people-data-content{
      margin: 10px auto;
      min-height: 360px;
      max-height: 360px;
      // max-height: calc(42vh - 14px);
      width: calc(90% + 0px);
      overflow: auto;
      border: 1px solid #dcdfe6;
      ul{
        li{
          display: flex;
          flex-direction: row;
          &:first-child{
            span{
              border-top: none;
            }
          }
          span{
            display: inline-block;
            width: 50%;
            text-align: center;
            background-color: #F5F7FA;
            line-height: 30px;
            border: 1px solid #dcdfe6;
            border-bottom: none;
            // border-left: 
            &:first-child{
              border-right: none;
              border-left: none;
            }
            &:last-child{
              border-right: none;
            }
            input{
              border: none;
              outline: none;
              background-color: transparent;
              width: 100%;
              height: 30px;
              text-align: center;
            }
            em{
              font-style:normal
            }
          }
        }
      }
        
    }
  }
</style>