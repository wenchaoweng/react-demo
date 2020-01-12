import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
//数据，store将数据聚拢一起，避免数据过于分散，也是redux的基础概念之一
var money = {
  amount: 100000
}
var user = {
  id: '123456',
  nickname: '土豪'
}
var store = {
  money: money,
  user: user
}
var fnLists = {}
//这是eventHub的简单实现，这个例子中用来实现管钱的功能
var eventHub = {
  trigger(eventName, data){
    //将fnLists对象的eventName属性值赋值给临时变量fnList。
    let fnList = fnLists[eventName]
    //如果没有人订阅eventName，fnList则为undefined，忽略就好。
    if(!fnList){return}
    //如果有人订阅该事件，则依次处理每个人订阅的回调函数
    for(let i=0; i<fnList.length; i++){
      fnList[i](data)
    }
  },
  on(eventName, fn){
    //初始时，对象fnLists里面没有属性eventName，所以fnLists[eventName]的值为undefined
    if(!fnLists[eventName]){
      //本例中，将对象fnLists的'我要花钱'的属性赋值为空数组
      fnLists[eventName] = []
    }
    //数组存放的是订阅事件的响应函数，如有多人订阅了同一事件，都往数据里面存放
    fnLists[eventName].push(fn)
  }
}
//监控每个人的"我想花钱"事件,一旦有人发布了"我想花钱"事件,即响应花钱,然后重新render整个APP
var x = {
  init(){
    eventHub.on('我想花钱', function(data){
      store.money.amount -= data
      //amount改了之后，需要重新render整个APP
      ReactDOM.render(<App />, document.getElementById('root'));
    })
  }
}
x.init()

var y = {
  init(){
    eventHub.on('我想花钱', function(data){
      console.log('y也收到了花钱事件')
    })
  }
}
y.init()

//父组件通过属性money，传值给子组件，子组件通过props参数接收
//整个数据的传递是从上往下的，即所谓的 单向数据流
class App extends React.Component {

  constructor(){
    super()
    this.state = {
      money: store.money
    }
  }

  render(){
    return (
      <div className='root'>
        <BigPapa money={this.state.money}></BigPapa>
        <YoungPapa money={this.state.money}></YoungPapa>
      </div>
    )
  }
}
class BigPapa extends React.Component {

  constructor(){
    super()
  }

  render(){
    return (
      <div className='papa'>大爸 {this.props.money.amount}
        <Son1 money={this.props.money}></Son1>
        <Son2 money={this.props.money}></Son2>
      </div>
    )
  }
}
class YoungPapa extends React.Component {

  constructor(){
    super()
  }

  render(){
    return (
      <div className='papa'>小爸 {this.props.money.amount}
        <Son3 money={this.props.money}></Son3>
        <Son4 money={this.props.money}></Son4>
      </div>
    )
  }
}

class Son1 extends React.Component {

  constructor(){
    super()
  }

  render(){
    return (
      <div className='son'>儿子1 {this.props.money.amount}
      </div>
    )
  }
}

class Son2 extends React.Component {

  constructor(){
    super()
  }
  x(){
    //action type, payload
    eventHub.trigger('我想花钱', 100)
  }

  render(){
    return (
      <div className='son'>儿子2 {this.props.money.amount}
        <button onClick={()=>this.x()}>消费</button>
      </div>
    )
  }
}
class Son3 extends React.Component {

  constructor(){
    super()
  }
  x(){
    eventHub.trigger('我想花钱', 200)
  }
  render(){
    return (
      <div className='son'>儿子3 {this.props.money.amount}
       <button onClick={()=>this.x()}>消费</button>
      </div>
    )
  }
}
class Son4 extends React.Component {

  constructor(){
    super()
  }

  render(){
    return (
      <div className='son'>儿子4 {this.props.money.amount}
      </div>
    )
  }
}

export default App;
