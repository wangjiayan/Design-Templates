import { on, isFunction, off, PlainObject } from './utils'

interface Handlers extends PlainObject {}

// 坐标
export interface Coordinate {
  top: number
  left: number
}

interface Props {
  start?: Function
  drag?: Function
  end?: Function
}

// 配置项
const defaults: Props = {
  start: () => {},
  drag: () => {},
  end: () => {}
}

/**
 * Draggable 基类
 * 用于元素在其父元素上自由拖拽
 * 如 Range
 * @export
 * @class Draggable
 * @extends {EventsBus}
 */
export class Draggable {
  // 是否正在拖拽中
  static dragging = false

  // 绑定事件的元素
  protected $el: Element

  // 事件句柄收集器
  protected handlers: Handlers

  // 配置项
  protected props: Props

  /**
   * Creates an instance of Draggable.
   * @param {Element} el
   * @param {Props} [options]
   * @memberof Draggable
   */
  constructor(el: Element, options?: Props) {
    this.$el = el
    this.handlers = Object.create(null)
    this.props = { ...defaults, ...options }
    // eslint-disable-next-line no-use-before-define
    bindEvents.call(this)
  }

  // 销毁
  destroy() {
    // eslint-disable-next-line no-use-before-define
    unbindEvents.call(this)
    this.$el = null as any
    this.handlers = null as any
  }
}
/**
 * 获取坐标
 * @function
 * @param el
 * @param event todo TouchEvent
 */
function getCoordinate(el: Element, event: MouseEvent | TouchEvent): Coordinate {
  const rect = el.getBoundingClientRect()
  const mouseEvent = event as MouseEvent
  const left = mouseEvent.clientX - rect.left
  const top = mouseEvent.clientY - rect.top
  return {
    top: Math.min(Math.max(0, top), rect.height),
    left: Math.min(Math.max(0, left), rect.width)
  }
}
/**
 * 拖拽结束事件
 * @private
 * @param {Draggable} this
 * @param {(MouseEvent | boolean)} event
 */
function handlerEnd(this: Draggable, event: MouseEvent | boolean) {
  off(document, 'mousemove', this.handlers.drag)
  off(document, 'mouseup', this.handlers.dragEnd)
  Draggable.dragging = false
  if (typeof event !== 'boolean') {
    this.props.end?.call(this, getCoordinate(this.$el, event), event)
  }
}
/**
 * 解绑DOM事件
 * @private
 * @param {Draggable} this
 */
function unbindEvents(this: Draggable) {
  const { handlers } = this
  const { $el } = this
  off($el, 'mousedown', handlers.dragStart)
  off($el, 'click', handlers.click)
  handlerEnd.call(this, false)
}

/**
 * 拖拽中事件
 * @private
 * @param {Draggable} this
 * @param {MouseEvent} event
 */
function handlerDrag(this: Draggable, event: MouseEvent) {
  if (isFunction(this.props.drag)) {
    this.props.drag?.call(this, getCoordinate(this.$el, event), event)
  }
}

/**
 * 点击事件
 * @private
 * @param {Draggable} this
 * @param {MouseEvent} event
 */
function handlerClick(this: Draggable, event: MouseEvent) {
  if (isFunction(this.props.end)) {
    this.props.end?.call(this, getCoordinate(this.$el, event), event)
  }
}
/**
 * 开始拖拽事件
 * @private
 * @param {Draggable} this
 * @param {MouseEvent} event
 */
function handlerStart(this: Draggable, event: MouseEvent) {
  if (Draggable.dragging) return
  event.preventDefault()
  on(document, 'mousemove', this.handlers.drag)
  on(document, 'mouseup', this.handlers.dragEnd)
  Draggable.dragging = true
  if (isFunction(this.props.start)) {
    this.props.start?.call(this, event)
  }
}

/**
 * 绑定DOM事件
 * @private
 * @param {Draggable} this
 */
function bindEvents(this: Draggable) {
  const { handlers } = this
  const { $el } = this
  handlers.dragStart = handlerStart.bind(this)
  handlers.drag = handlerDrag.bind(this)
  handlers.dragEnd = handlerEnd.bind(this)
  handlers.click = handlerClick.bind(this)
  on($el, 'mousedown', handlers.dragStart)
  on($el, 'click', handlers.click)
}

export default Draggable
