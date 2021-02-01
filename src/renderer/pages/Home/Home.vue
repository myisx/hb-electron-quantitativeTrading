<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="12">
      <el-col :span="8">
        <div class="distribute">
          <div style="    font-size: 45px;">
            <!-- <el-button icon="el-icon-video-play" circle></el-button>
            <el-button type="warning" icon="el-icon-refresh" circle></el-button> -->
            <i :class="status==0?'el-icon-video-play':'el-icon-video-pause'" @click="start"></i>
            <i class="el-icon-refresh" @click="updateStrategy(true)"></i>
          </div>
          <div style="    padding: 10px;">
            <div style="    border: solid 1px rgb(43, 55, 68);"></div>
          </div>
          <div>
            <div>当前周期</div>
            <div class="huobi-zhouqis">
              <el-radio-group v-model="period" @change="selectPeriod">
                <el-col :span="8">
                  <el-radio label="1min">1分钟</el-radio>
                </el-col>
                <el-col :span="8">
                  <el-radio label="5min">5分钟</el-radio>
                </el-col>
                <el-col :span="8">
                  <el-radio label="15min">15分钟</el-radio>
                </el-col>
                <el-col :span="8">
                  <el-radio label="30min">30分钟</el-radio>
                </el-col>
                <el-col :span="8">
                  <el-radio label="60min">1小时</el-radio>
                </el-col>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-col>
      <el-col style="border-left: solid 1px rgb(43, 55, 68);" :span="8">
        <div class="distribute huobi-info">
          <div class="huobi-text" >
            <!-- <p><span class="title">当前资产：</span><span class="text">{{info[0]}}</span></p> -->
            <p><span class="title">当前策略：</span><span class="text">{{historyPolicys&&historyPolicys.length>0?historyPolicys[selectHistoryPolicy].title?historyPolicys[selectHistoryPolicy].title:selectHistoryPolicy+'号策略':'未选择策略'}}</span></p>
            <p><span class="title">时间周期：</span><span class="text">{{period}}</span></p>
            <p><span class="title">历史收益：</span><span class="text">{{historyPolicys&&historyPolicys.length>0?historyPolicys[selectHistoryPolicy].profit.toFixed(2):'未选择策略'}}</span></p>
            <p><span class="title">盈亏情况：</span><span class="text">{{historyPolicys&&historyPolicys.length>0?historyPolicys[selectHistoryPolicy].status:'未选择策略'}}</span></p>
            <!-- <p><span class="title">测试时间 ：</span><span class="text">{{direction[info.direction]}}&nbsp;x{{info.lever_rate}}</span></p> -->
          </div>
        </div>
      </el-col>
      <el-col style="border-left: solid 1px rgb(43, 55, 68);" :span="8">
        <div class="distribute huobi-info">
          <!-- <div class="huobi-text" >
            <p><span class="title">已成交量：</span><span class="text">{{info.volume}}</span></p>
            <p><span class="title">成交价格：</span><span class="text">{{info.cost_open.toFixed(2)}}</span></p>
            <p><span class="title">当前价格：</span><span class="text">{{info.last_price}}</span></p>
            <p><span class="title">委托类型：</span><span class="text">{{direction[info.direction]}}&nbsp;x{{info.lever_rate}}</span></p>
            <p><span class="title">收益情况：</span><span class="text">{{info.profit_rate.toFixed(4)}}%&nbsp;|&nbsp;{{info.profit.toFixed(4)}}</span></p>
          </div> -->
          <div class="huobi-text" >
            <!-- <p><span class="title">已成交量：</span><span class="text">{{info.volume}}</span></p> -->
            <p><span class="title">可用金额：</span><span class="text">{{info.margin_available}}$</span></p>
            <p><span class="title">当前价格：</span><span class="text">{{newPrice}}</span></p>
            <p><span class="title">委托类型：</span><span class="text">{{direction[orderInfo.status]}}&nbsp;x{{orderInfo.lever_rate?orderInfo.lever_rate:placeInfo.leverage}}</span></p>
            <p><span class="title">收益情况：</span><span class="text">{{info.profit_real}}%</span></p>
          </div>
        </div>
      </el-col>
      <el-col :span="24" style="border-left: solid 1px rgb(43, 55, 68);">
        <div class="Echarts">
            <echarts ref="tEcharts" @payOrder="payOrder" :period="period" @historyPolicy="historyPolicy"></echarts>
        </div>
      </el-col>
    </el-row>
    </el-card>
    <div style="height:30px;"></div>

  <el-tabs  type="border-card" style="height:192px;">
  <el-tab-pane label="策略选择" >
    <div>
      <el-row :gutter="12">
        
          <el-radio-group @change="selectHistoryPolicyChange" v-model="selectHistoryPolicy">
            <el-col :span="12" v-for="(item,index) in historyPolicys" :key="index">
            <el-radio border size="mini"  :label="index">{{item.title?item.title:index+'号策略'}} | 收益({{item.profit.toFixed(2)}}%) | 盈/亏({{item.status}})</el-radio>
            </el-col>
          </el-radio-group>
      </el-row>
    </div>
  </el-tab-pane>
  <el-tab-pane label="策略配置">
    <div>
      <el-form ref="form"  :rules="rules" :model="strategy" label-width="95px">
        <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="学习率" prop="name">
          <el-input v-model="strategy.learning" placeholder="学习率">
            <el-link slot="suffix" @click="showMessage('越大迭代越快 但有可能会错过最优策略')" :underline="false">说明<i class="el-icon-warning-outline
 el-icon--right"></i> </el-link>
          </el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="M" prop="name">
          <el-input v-model="strategy.m" type="number" :min="1" :max="20" placeholder="M值"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="N" prop="name">
          <el-input v-model="strategy.n" type="number" :min="1" :max="500" placeholder="N值"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="name">
            <!-- <span slot="label">
              策略更新
              <i class="el-icon-warning-outline"></i>
            </span> -->
            <el-switch  slot="label"
              v-model="strategy.timeFlg"
              active-text="开启"
  inactive-text="禁止">
            </el-switch>
            <el-input type="number" :min="1" :max="366" placeholder="定时更新策略(天)" :disabled="!strategy.timeFlg" v-model="strategy.time">
              <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
              <el-link slot="suffix" @click="showMessage('会每隔N天重新计算并选择当天最优策略')" :underline="false">说明<i class="el-icon-warning-outline
 el-icon--right"></i> </el-link>
            </el-input>
            <!-- <el-link>查看<i class="el-icon-view el-icon--right"></i> </el-link> -->
            <!-- <el-input-number v-model="strategy.time" :min="1" :max="1000" label="定时更新"></el-input-number> -->

        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="save(keys[0],strategy)" size="small">保存</el-button>
        </el-col>
        </el-row>
      </el-form>

      
    </div>
  </el-tab-pane>
  <el-tab-pane label="下单设置">
    <div>
      <el-form ref="form"  :rules="rules" :model="placeInfo" label-width="80px">
        <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="成交价格" prop="transactionPrice">
          <el-input v-model="placeInfo.transactionPrice" placeholder="按收益百分比平仓"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="杠杆倍数" prop="leverage">
          <el-input v-model="placeInfo.leverage" placeholder="杠杆倍数"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交易类型" prop="transactionType">
          <el-checkbox-group v-model="placeInfo.transactionType">
            <el-checkbox :label="1">买入</el-checkbox>
            <el-checkbox :label="2">卖出</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="save(keys[1],placeInfo)" size="small">保存</el-button>
        </el-col>
        </el-row>
      </el-form>
    </div>
  </el-tab-pane>
  <el-tab-pane label="系统配置">
    <el-form ref="form3"  :rules="rules" :model="setting" label-width="80px">
        <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="Access Key" prop="name">
          <el-input v-model="setting.accessKey" placeholder="Access Key"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Secret Key" prop="name">
          <el-input v-model="setting.secretKey" placeholder="Secret Key"></el-input>
        </el-form-item>
        </el-col>
        <!-- <el-col :span="10">
          <el-form-item label="实时K线" prop="name">
          <el-switch
            v-model="setting.realTimeFlg"
            active-text="开启"
            inactive-text="禁止">
          </el-switch>
        </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-button type="primary" @click="save(keys[2],setting)" size="small">保存</el-button>
        </el-col>
        </el-row>
      </el-form>
  </el-tab-pane>
  <el-tab-pane label="邮箱配置">
<div>
      <el-form ref="form"  :rules="rules" :model="mailInfo" label-width="80px">
        <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="邮箱账号" prop="name">
          <el-input v-model="mailInfo.mailUserName" placeholder="邮箱账号"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱密码" prop="name">
          <el-input v-model="mailInfo.mailPassword" type="password" placeholder="邮箱密码"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收件邮箱" prop="name">
          <el-input v-model="mailInfo.addressee" placeholder="收件人邮箱"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发送条件" prop="name">
          <el-checkbox-group v-model="mailInfo.send">
            <el-checkbox label="1">买入</el-checkbox>
            <el-checkbox label="2">卖出</el-checkbox>
            <el-checkbox label="3">平仓</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="sendEmail" size="small">测试发送</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="save(keys[3],mailInfo)" size="small">保存</el-button>
        </el-col>
        </el-row>
      </el-form>
    </div>
  </el-tab-pane>
  
</el-tabs>
  </div>
</template>
<script>
import echarts from '../../components/echarts'
import {contract_code} from '@/config/env'
export default {
  components:{
    echarts
  },
  data(){
    return{
      // 订单状态
      status:0,
      placeInfo:{leverage:1,transactionType:[1,2]},
      mailInfo:{send:['1','2','3']},
      rules: {},
      period:'1min',
      setting:{realTimeFlg:false},
      historyPolicys:[],
      // direction:{
      //   buy:'买入',
      //   sell:'卖出'
      // },
      strategy:{},
      direction:{
        '-1':'没有委托',
        '1':'买入',
        '2':'卖出'
      },
      selectHistoryPolicy:0,
      info:{},
      keys:['strategy','placeInfo','setting','mailInfo'],
      socket:null,
      lineList:[],
      newPrice:0,
      orderInfo:{status:-1},
      // k先定时器
      schedule:null,
      // 策略定时器
      strategyScheduleId:null,
      // 用户信息定时器
      userInfoSchedule:null,
      /**
       * 平仓，开仓
       */
      offset:['close','open','open'],
      /**
       * 限价，对手价
       */
      order_price_type:['limit','opponent'],
      // 订单间隔  在订单撤销后 下个周期将会禁止下单
      orderInterval:0,
      count:0,
      countMax:1 // 最多等待多少次
    }
  },
  created(){
    this.initData()
    this.socketInit()
  },
  mounted(){
    this.confingInit()
    this.swap_account_position_info()
  },
  methods:{
    // 初始化数据
    initData(){
      let earnings = this.$store.get('earnings')
      if(earnings == null){
        this.$store.set('earnings',{profit_rate:0.0,profit:0.0})
      }
      this.strategy = this.$store.get('strategy')
      if(this.strategy == null || this.strategy.n == null){
        this.strategy = {learning:0.01,time:7,timeFlg:false,n:200,m:6}
        this.$store.set('strategy',this.strategy)
      }
      this.placeInfo = this.$store.get('placeInfo')
      if(this.placeInfo == null || this.placeInfo.transactionType==null) {
        this.placeInfo = {leverage:1,transactionType:[1,2]}
        this.$store.set('placeInfo',this.placeInfo)
      }
      this.setting = this.$store.get('setting') || {}
      
    },
    setStrategyDay(e){
      if(this.strategy.timeFlg && e){
        if(this.strategyScheduleIdnull){
          this.strategyScheduleId.cancel();
        }
        var cron = '01 * * 0/'+e+' * *'
        var this_ = this
        var i = 0
        this.strategyScheduleId = this.$schedule.scheduleJob(cron, function(){
          if(i == 0){
            this_.updateStrategy()
          }
        });
      }else if(this.strategyScheduleId){
        this.strategyScheduleId.cancel();
        this.strategyScheduleId = null
      }
    },
    updateStrategy(flg = false){
      if(!this.examineSetting()){
        return;
      }
      
      this.$refs.tEcharts.getHistoryPolicy(this.strategy,flg)
    },
    selectHistoryPolicyChange(e){
      this.$refs.tEcharts.testHistoryPolicy(this.historyPolicys[e],true);
    },
    // 查询用户账户和持仓信息
    swap_account_position_info(){
      if(!this.examineSetting()){
        return;
      }
      this.info={}
      this.$service.swap_account_position_info().then(res=>{
        if(!res.data){
          this.$message({
            message: res.err_msg,
            type: 'error'
          });
          return;
        }
        // 当前杠杆
        this.info['lever_rate'] = res.data[0].lever_rate
        this.placeInfo.leverage = this.placeInfo.leverage?this.placeInfo.leverage:this.info['lever_rate']
        // 已实现亏盈
        this.info['profit_real'] = res.data[0].profit_real
        // 未实现盈亏
        this.info.profit_unreal = res.data[0].profit_unreal
        // 保证金率
        this.info.risk_rate = res.data[0].risk_rate
        // 预估爆仓点
        this.info.liquidation_price = res.data[0].liquidation_price
        // 可用金额
        // this.info['margin_available'] = res.data[0].margin_available.toFixed(2)
        this.$set(this.info,'margin_available',res.data[0].margin_available.toFixed(2))
        if(res.data[0].positions!=0){
          this.orderInfo = res.data[0].positions[0]
          if(this.orderInfo.direction == 'buy'){
            this.orderInfo.status = 1
          }else{
            this.orderInfo.status = 2
          }
          this.info.profit_real = res.data[0].positions[0].profit_rate * 100
          this.info.profit = res.data[0].positions[0].profit 
          
        }else{
          this.orderInfo.status = -1
          this.orderInfo.lever_rate = this.placeInfo.leverage
          this.orderInfo.margin_available = this.info.margin_available
        }
      })
    },
    /**
     * 获取所有未成交的订单
     */
    swap_cancelall(){
      this.$service.swap_cancelall().then(res=>{
        if(res.err_code&&res.err_code==1051){
          // this.sendEmail('下单失败',JSON.stringify(res))
          this.sendEmail('下单成功通知',JSON.stringify(res))
        }else{
          this.sendEmail('挂单-下单失败',JSON.stringify(res))
          this.orderInterval = 1;
        }
        this.swap_account_position_info()
      })
    },
    socketInit(){
      var this_ = this
      var refs = this.$refs
      this.$socket.creationWss(contract_code,this.period,function (res){
        if(this_.$refs.tEcharts == null){
          return;
        }
        var a = JSON.parse(res)
        if(a.rep){
          // 如果不是实盘状态 那么就更新策略
          if(this_.status == 0){
            refs.tEcharts.getLine(a.data,true,this_.strategy)
          }else if(this_.status == 1){
            if(this_.$refs.tEcharts)
              this_.$refs.tEcharts.satrtActual(a.data,this_.historyPolicys[this_.selectHistoryPolicy].n,this_.historyPolicys[this_.selectHistoryPolicy].m,this_.orderInfo)
          }
          this_.lineList = a.data
          if(a.data.length>0){
            this_.newPrice = a.data[a.data.length-1].close
          }
        }
        else if(a.tick){
          if(!this_.setting.realTimeFlg){
            return;
          }
          // 确保已经获取到k先数据
          if(this_.lineList.length>this_.historyPolicys[this_.selectHistoryPolicy].n){
            if(this_.lineList[this_.lineList.length-1].id == a.tick.id){
              this_.lineList[this_.lineList.length-1] = a.tick
              //this_.$set(this_.lineList,this_.lineList.length-1,a.tick)
              // console.log('插入',a.tick)
            }else if(this_.lineList[this_.lineList.length-2].id == a.tick.id){
              // 假设获取k线的时候已经过了当前时间周期， 这时候可以选择跳过
              return;
            }else{
              // 判断 k是否已经进入下一根k线
              if(a.tick.id - this_.lineList[this_.lineList.length-1].id / 60 ==  parseInt(this_.period.replace('min',''))){
                //console.log('插入')
                // this_.lineList.push(a.tick)
                // this_.lineList.splice(1,this_.lineList.length)
              }else{
                // 未知情况  重新获取下k先数据
                this_.count = this_.countMax
                return
              }
            }
            this_.newPrice = a.tick.close
            // 更新k线
              this_.$refs.tEcharts.satrtActual(this_.lineList,this_.historyPolicys[this_.selectHistoryPolicy].n,this_.historyPolicys[this_.selectHistoryPolicy].m,this_.orderInfo)
          }else if(this_.count!=this_.countMax){
            this_.count++;
          }else{
            this_.count = 0
            this_.lineInit(300)
          }
        }
      }).then(res=>{
        this.socket = res
        this.lineInit()
      }).catch(e=>{
        this.$message({
            message: 'socket连接失败 请重启软件重试',
            type: 'error'
        });
      })
    },
    showMessage(value,type='warning'){
      this.$message({
          message: value,
          type: type
      });
    },
    // K线初始化
    lineInit(size = 2000){
      this.socket.getLine({period:this.period,totality:size});
    },
    // K线订阅
    subLine(){
        if(this.setting.realTimeFlg){
          // this.socket.subLine({period:this.period});
        }
    },
    
    // 配置初始化
    confingInit(){
      for(var i =0;i<this.keys.length;i++){
        var s = this.$store.get(this.keys[i])
        if(s) this.$set(this,this.keys[i],s)
      }
    },
    getEarningsInfo(a){
      var earnings = this.$store.get('earnings')
      return  earnings.profit_rate.toFixed(2) + ' | ' +earnings.profit.toFixed(2) + '%'
    },
    examineSetting(){
      if(this.setting.secretKey!=null && this.setting.secretKey.length>5 && this.setting.accessKey != null && this.setting.accessKey.length>5 ){
        
        return true
      }
      this.$message({
            message: '系统配置的secretKey和accessKey不能为空',
            type: 'error'
      });
      return false
    },
    /**
     * 开始实盘
     */
    start(){
      if(!this.examineSetting()){
        return;
      }
      this.swap_account_position_info()
      this.status = this.status == 0 ?1:0
      if(this.status == 1){
        this.$store.set('historyPolicys',{...this.historyPolicys[this.selectHistoryPolicy],title:'本地策略'})
        this.lineInit(300)
        // this.subLine()
        // this.socket.subLine({period:this.period});
        var min = parseInt(this.period.replace('min',''))
        var cron = '58 0/'+min+' * * * *'
        var this_ = this
        var i = 0
        this.schedule = this.$schedule.scheduleJob(cron, function(){
          if(i == 0){
            i = 1
            if(this.orderInterval == 0 ){
            this_.lineInit(300)
            }else{
              this.orderInterval = 0
            }
            // this_.subLine()
            i = 0
          }
        });

        this.userInfoSchedule = this.$schedule.scheduleJob("01 0/5 * * * *", function(){
          this_.swap_account_position_info()
        })
      }else{
        //关闭定时任务
        if(this.schedule){
          this.schedule.cancel();
          this.schedule = null
        }
        if(this.userInfoSchedule){
          this.userInfoSchedule.cancel();
          this.userInfoSchedule = null
        }
        this.lineInit()
      }
      // this.socket.subLine({period:this.period});
    },
    payOrder(e){
      if(e == -1) return;
      console.log('订单交易',this.orderInfo)
      var order = null
      // 汇率 以太坊 比特币
      var exchange  = contract_code == 'ETH-USDT'?0.01:0.001
      if(e == 0){
        order = {
          // 买入价格
          // price:this.orderInfo.cost_open,
          price:this.orderInfo.cost_open,
          // 合约张数
          volume:this.orderInfo.available,
          // 买卖
          direction:this.orderInfo.direction,
          // 开仓 平仓
          offset:this.offset[e],
          // 杠杆
          lever_rate:this.placeInfo.leverage,
          // 限价 对手价
          order_price_type:this.order_price_type[1]
        }
        console.log('平仓参数',order)
      }else{
        order = {
          // 买入价格
          price:this.orderInfo.cost_open,
          // 合约张数
          volume:parseInt(this.info.margin_available / this.orderInfo.cost_open /exchange*this.placeInfo.leverage),
          // volume:1,
          // 买卖
          direction:this.orderInfo.direction,
          // 开仓 平仓
          offset:this.offset[e],
          // 杠杆
          lever_rate:this.placeInfo.leverage,
          // 限价 对手价
          order_price_type:this.order_price_type[0]
        }
      }
      this.$service.swap_order(order).then(res=>{
        if(res.status != 'ok'){
          console.log(res)
          this.$message({
              message: '下单失败',
              type: 'error'
          });
          this.sendEmail('下单失败',"结果："+JSON.stringify(res)+", 参数："+JSON.stringify(order))
          
          return;
        }
        console.log("成功下单")
        var this_ = this
        setTimeout(() => {
          console.log('检查订单')
          this_.swap_cancelall()
        }, 50000)

      })
    },
    selectPeriod(e){
      this.status = 0
      if(this.socket){
        this.lineInit()
      }else{
        this.$message({
            message: 'socket连接失败 请重启软件重试',
            type: 'error'
        });
      }
    },
    historyPolicy(res){
      if(this.$store.get('historyPolicys')){
        res = [this.$store.get('historyPolicys'),...res];
      }
      this.historyPolicys = res.splice(0,9)
    },
    // 保存setting
    save(key,value){
      if(this.keys[0] == key){
        this.setStrategyDay(value.time);
      }
      this.$store.set(key,value)
      this.$message({
            message: '信息已保存',
            type: 'success'
          });
      if(this.keys[2] == key){
        this.swap_account_position_info()
      }
    },
    sendEmail(subject = '测试邮件',text = '测试信息'){
      this.$sendEmail({subject:subject,text:text}).then(res=>{
        if(res.status==0){
          this.$message({
            message: '邮件已发送',
            type: 'success'
          });
        }else{
          this.$message({
            message: res.data,
            type: 'warning'
          });
        }
      })
    }
  }
}
</script>
<style>
.huobi-zhouqis{
    text-align: left;
    padding-left: 25px;
    padding-top: 6px;
}
/* element start */
.el-input__inner{
    background-color: initial;
    border-radius: 0;
    height: 29px;
    color: #fff;
    border: 0;
    border-bottom: solid 1px #485063;
}
.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
      background-color: rgb(65, 73, 80);
      color: aliceblue;
}
.el-tabs--border-card>.el-tabs__header{
      background-color: rgb(31, 38, 45);
      border: initial;
}
.el-tabs--border-card{
      background: #1f2c35;
      border: initial;
}
.el-tabs{
      border-radius: 5px;
}
..el-input.is-disabled .el-input__inner{
      background-color: initial;
    border-color: initial;
    color: #e6a23c;
}
/* element end */
.huobi-order-text{
  padding: 5px;
}
.huobi-zd-text{
  font-size: 80px;
}
.huobi-info{
    text-align: left;
    padding-left: 20px;
}
.huobi-title{
      font-weight: 700;
}
.huobi-text {
  font-weight: 100;
}
.distribute{
  color: #fff;
}
.box-card{
      font-size: 13px;
      border: initial;
      border-radius: 38px;
      background: #1f2c35;
}
body {
  margin: 0;
}

.distribute{
  height: 120px;
}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
        -webkit-appearance:textfield;
    }    
    input[type="number"]{
        -moz-appearance:textfield;
    }
</style>
