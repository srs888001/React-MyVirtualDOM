import isFunctionComponent from "./isFunctionComponent"
import mountNativeElement from "./mountNativeElement"
import isFunction from "./isFunction"

export default function mountComponent(virtualDOM, container, oldDOM) {
  let nextVirtualDOM = null
  let component = null

  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
    component = nextVirtualDOM.component
  }
  
  // 挂载创建的Dom
  if (isFunction(nextVirtualDOM)) {
    // 说明内部直接就是<Component />
    mountComponent(nextVirtualDOM, container, oldDOM)
  } else {
    mountNativeElement(nextVirtualDOM, container, oldDOM)
  }

  // 生命周期
  if (component) {
    component.componentDidMount()
    if (component.props && component.props.ref) {
      // 组件 更新 ref
      // 调用实例对下ref方法， 传入参数component
      component.props.ref(component)
  
    }
  }
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {})
}

function buildClassComponent(virtualDOM) {
  // virtualDOM.type 会调用组件的构造方法。 同时传递参数
  const component = new virtualDOM.type(virtualDOM.props || {})
  const nextVirtualDOM = component.render()
  // 把实例对象绑定到虚拟Dom里面
  nextVirtualDOM.component = component
  return nextVirtualDOM
}
