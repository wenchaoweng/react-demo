import React from 'react';
import ReactDOM from 'react-dom';
//1. 从redux引入createStore
import { createStore } from 'redux'
//2. 定义一个reducer函数，带2个参数，state和action，state用来保存数据状态，action用来保存事件类型。
function reducer(state, action){
  //3. 初始化或更新state值
  let mState = state || {
    money: {
      amount: 100000
    }
  }
  //4. 判断是哪个订阅事件，即action.type
  switch(action.type){
    case '我想花钱':
      return{
        money: {
          amount: mState.money.amount - action.payload
        }
      }
    default:
      return mState
  }
}
//5. 通过createStroe创建store
let store = createStore(reducer)
//6. 通过store.subscribe订阅事件，只要有action.type的事件就会执行里面的render函数
store.subscribe(() => render())

//数据，store将数据聚拢一起，避免数据过于分散，也是redux的基础概念之一
// var money = {
//   amount: 100000
// }
// var user = {
//   id: '123456',
//   nickname: '土豪'
// }
// var store = {
//   money: money,
//   user: user
// }
// var fnLists = {}
// //这是eventHub的简单实现，这个例子中用来实现管钱的功能
// var eventHub = {
//   trigger(eventName, data){
//     //将fnLists对象的eventName属性值赋值给临时变量fnList。
//     let fnList = fnLists[eventName]
//     //如果没有人订阅eventName，fnList则为undefined，忽略就好。
//     if(!fnList){return}
//     //如果有人订阅该事件，则依次处理每个人订阅的回调函数
//     for(let i=0; i<fnList.length; i++){
//       fnList[i](data)
//     }
//   },
//   on(eventName, fn){
//     //初始时，对象fnLists里面没有属性eventName，所以fnLists[eventName]的值为undefined
//     if(!fnLists[eventName]){
//       //本例中，将对象fnLists的'我要花钱'的属性赋值为空数组
//       fnLists[eventName] = []
//     }
//     //数组存放的是订阅事件的响应函数，如有多人订阅了同一事件，都往数据里面存放
//     fnLists[eventName].push(fn)
//   }
// }
//监控每个人的"我想花钱"事件,一旦有人发布了"我想花钱"事件,即响应花钱,然后重新render整个APP
// var x = {
//   init(){
//     eventHub.on('我想花钱', function(data){
//       store.money.amount -= data
//       //amount改了之后，需要重新render整个APP
//       ReactDOM.render(<App />, document.getElementById('root'));
//     })
//   }
// }
// x.init()

// var y = {
//   init(){
//     eventHub.on('我想花钱', function(data){
//       console.log('y也收到了花钱事件')
//     })
//   }
// }
// y.init()

//父组件通过属性money，传值给子组件，子组件通过props参数接收
//整个数据的传递是从上往下的，即所谓的 单向数据流
class App extends React.Component {

  constructor(){
    super()
    //使用store.getStore()，就不用组件自己的state了。
    // this.state = {
    //   money: store.money
    // }
  }

  render(){
    return (
      <div className='root'>
        <BigPapa money={this.props.store.money}></BigPapa>
        <YoungPapa money={this.props.store.money}></YoungPapa>
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
  // x(){
  //   //action type, payload
  //   eventHub.trigger('我想花钱', 100)
  // }

  render(){
    return (
      <div className='son'>儿子2 {this.props.money.amount}
        {/* //<button onClick={()=>this.x()}>消费</button> */}
      </div>
    )
  }
}
class Son3 extends React.Component {

  constructor(){
    super()
  }

  render(){
    return (
      <div className='son'>儿子3 {this.props.money.amount}
       <button onClick={()=>{
         //8. 使用store.dispatch发布事件，带2个参数，type是事件类型，payload是要改变的值
         store.dispatch({ type: '我想花钱', payload: 100})
       }}>消费</button>
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
render()
function render(){
  //7. store通过store.getState()传入每个子组件的props参数内
  ReactDOM.render(<App store={store.getState()}/>, document.getElementById('root'));
}

export default App;
