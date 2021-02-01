<template>
    <div style="width:100%;height: 300px;">
        <div id="main" style="height:300px ;width:100%;"></div>
    </div>
</template>
<script>
import  * as echarts from 'echarts'
import {calculateAverage,optimizeStrategy,satrtActual} from '@/utils/line.js';
import {dateFormat} from '@/utils/date.js';
import datas from '../assets/data/data.json'
var charts=null;
export default {
    data(){
        return{
            charts:null,
            flg:0,
        }
    },
    mounted(){
        // this.getLine();
    },
    props:{
        period:{
            type:String,
            default:'5min'
        },
        size:{
            type:Number,
            default:2000
        }
    },
    methods:{
        getLine(data,setCl=true,strategyInfo){
            charts=echarts.init(document.getElementById('main'));
            if(!data){
                this.$service.kline({period:this.period,size:2000}).then(res=>{
                    var a = optimizeStrategy(res.data,strategyInfo)
                    this.$emit('historyPolicy',a.historyPolicy)
                    this.setDate(a)
                })
            }else{
                var a = optimizeStrategy(data,strategyInfo)
                this.$emit('historyPolicy',a.historyPolicy)
                this.setDate(a)
            }
        },
        getHistoryPolicy(strategyInfo,setDateFlg=false){
            this.$service.kline({period:this.period,size:2000}).then(res=>{
                    var a = optimizeStrategy(res.data,strategyInfo,false)
                    this.$emit('historyPolicy',a.historyPolicy)
                    if(setDateFlg){
                        this.setDate(a)
                    }
                })
        },
        testHistoryPolicy(strategyInfo,setDateFlg=false){
            this.$service.kline({period:this.period,size:2000}).then(res=>{
                    var a = optimizeStrategy(res.data,strategyInfo,setDateFlg)
                    this.setDate(a)
            })
        },
        satrtActual(data,n,m,order){
            var data = satrtActual(data,n,m,order)
            if(data.status!=-1){
                this.$emit('payOrder',data.status)
            }
            this.setDate(data)
        },
        setDate(a){
            this.init(a)
        },
        init(a){
            var line = []
            var top = []
            var times = []
            var down = []
            var middle = []
            var buy = []
            var sell = []
            var close = []
            for(var i=0;i<a.line.length;i++){
                line.push([a.line[i].open,a.line[i].close,a.line[i].low,a.line[i].high])
                top.push(a.cl[i].top)
                down.push(a.cl[i].down)
                middle.push(a.cl[i].middle)
                times.push(dateFormat(a.line[i].time,'mm-dd HH:MM'))
                if(a.line[i].status== '-'){
                    buy.push(a.line[i].status)
                    sell.push(a.line[i].status)
                    close.push(a.line[i].status)
                }else{
                    if( a.line[i].status == 1){
                        buy.push(a.line[i].price)   
                        sell.push('-')
                        close.push('-')
                    }else if(a.line[i].status == 2){
                        sell.push(a.line[i].price)
                        buy.push('-')
                        close.push('-')
                    }else{
                        close.push(a.line[i].price)
                        buy.push('-')
                        sell.push('-')
                    }
                }
            }
            this.myEcharts({times,line,top,down,middle,buy,sell,close})
        },
        myEcharts(obj){
        // 基于准备好的dom，初始化echarts实例

            // 指定图表的配置项和数据
            var option = {
                    backgroundColor: '#1f2c35',
                    legend: {
                        data: ['上轨线', '中轨线', '下轨线', 'K线', '买入', '卖出', '平仓'],
                        inactiveColor: '#777',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false,
                        type: 'cross',
                        lineStyle: {
                            color: '#376df4',
                            width: 2,
                            opacity: 1
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: obj.times,
                    axisLine: { lineStyle: { color: '#8392A5' } }
                },
                yAxis: {
                    scale: true,
                    axisLine: { lineStyle: { color: '#8392A5' } },
                    splitLine: { show: false }
                },
                grid: {
                    bottom: 80
                },
                dataZoom: [{
                textStyle: {
                    color: '#8392A5'
                },
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                dataBackground: {
                    areaStyle: {
                        color: '#8392A5'
                    },
                    lineStyle: {
                        opacity: 0.8,
                        color: '#8392A5'
                    }
                },
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }, {
                type: 'inside'
            }],
            animation: false,
                series: [
                    {
                            name: '上轨线',
                            type: 'line',
                            data: obj.top,
                            smooth: true,
                            showSymbol: false,
                            lineStyle: {
                                width: 1
                            }
                        },
                        {
                            name: '中轨线',
                            type: 'line',
                            data: obj.middle,
                            smooth: true,
                            showSymbol: false,
                            lineStyle: {
                                width: 1
                            }
                        },
                        {
                            name: '下轨线',
                            type: 'line',
                            symbolSize:1,
                            smooth: true,
                            data: obj.down,
                            smooth: true,
                            showSymbol: false,
                            lineStyle: {
                                width: 1
                            }
                        },
                        {
                            type: 'candlestick',
                            name: 'K线',
                            data: obj.line,
                            itemStyle: {
                                color: '#FD1050',
                                color0: '#0CF49B',
                                borderColor: '#FD1050',
                                borderColor0: '#0CF49B'
                            }
                        },
                        {
                            name: '买入',
                            type: 'effectScatter',
                            symbol: 'pin',
                            symbolSize: 20,    //气泡大小
                            data: obj.buy,
                        },
                        {
                            name: '卖出',
                            type: 'effectScatter',
                            symbol: 'pin',
                            symbolSize: 20,    //气泡大小
                            data: obj.sell,
                        },
                        {
                            name: '平仓',
                            type: 'effectScatter',
                            symbol: 'pin',
                            symbolSize: 20,    //气泡大小
                            data: obj.close,
                        }
                ]
            };


            // 使用刚指定的配置项和数据显示图表。
            charts.setOption(option);
            }
        }
}
</script>
<style>
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
  }
  ::-webkit-scrollbar-track {
   /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : rgb(43, 55, 68);
  border-radius: 10px;
  }
</style>