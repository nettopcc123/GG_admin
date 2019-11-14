<template>
  <div class="shengxiao-vison">
    <div class="shengxiao-head">
      <p>
        <span>方位</span>
        <span>球号</span>
      </p>
      <p>
        <span>方位</span>
        <span>球号</span>
      </p>
    </div>
    <div class="shengxiao-chooseBall">
      <ul v-for="(item,index) in wanfaData" :key="index">
        <li>{{ item.betValue }}</li>
        <li>
          <span v-for="(ball,ballindex) in item.playBalls" :key="ballindex">{{ ball.ballValue }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "detail_fangwei",
  computed: {
    ...mapState({
      wanfaData: state => state.lc_basic.wanfaData
    })
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/commonWanfa.scss";

.shengxiao-vison {
  // border: 1px solid gainsboro;
  .shengxiao-head {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    p {
      width: 49%;
      display: flex;
      justify-content: space-between;
      span {
        border: 1px solid gainsboro;
        width: 71%;
        background: #ebeef5;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      span:first-child {
        width: 25%;
        // margin-right: 10px;
      }
    }
  }
  .shengxiao-chooseBall {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    //   height: 230px;
    ul {
      display: flex;
      flex-direction: row;
      margin-bottom: 5px;
      width: 49%;
      justify-content: space-between;
      li {
        list-style: none;
        // display: flex;
        // justify-content: space-between;
      }
      li:first-child {
        border: 1px solid gainsboro;
        height: 30px;
        line-height: 30px;
        text-align: center !important;
        width: 25%;
      }
      li:last-child {
        width: 71%;
        display: flex;
        flex-direction: row;
        margin-left: 10px;
        span {
          display: inline-block;
          width: 20%;
          border: 1px solid gainsboro;
          height: 30px;
          background: #f5f7fa;
          margin-right: 5px;
          line-height: 30px;
          text-align: center;
          &:nth-child(5n){
            margin-right: 0px;
          }
        }
      }
    }
  }
}
</style>


