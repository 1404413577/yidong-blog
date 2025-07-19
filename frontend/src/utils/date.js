import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 格式化日期时间
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatDateTime(date) {
  return formatDate(date, 'YYYY-MM-DD HH:mm')
}

/**
 * 相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 相对时间字符串
 */
export function fromNow(date) {
  if (!date) return ''
  return dayjs(date).fromNow()
}

/**
 * 智能时间显示
 * 1天内显示相对时间，超过1天显示具体日期
 * @param {string|Date} date - 日期
 * @returns {string} 时间字符串
 */
export function smartTime(date) {
  if (!date) return ''
  
  const now = dayjs()
  const target = dayjs(date)
  const diffDays = now.diff(target, 'day')
  
  if (diffDays < 1) {
    return target.fromNow()
  } else if (diffDays < 7) {
    return target.format('MM-DD HH:mm')
  } else if (now.year() === target.year()) {
    return target.format('MM-DD')
  } else {
    return target.format('YYYY-MM-DD')
  }
}

/**
 * 判断是否为今天
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否为今天
 */
export function isToday(date) {
  if (!date) return false
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * 判断是否为本周
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否为本周
 */
export function isThisWeek(date) {
  if (!date) return false
  return dayjs(date).isSame(dayjs(), 'week')
}

/**
 * 获取月份名称
 * @param {string|Date} date - 日期
 * @returns {string} 月份名称
 */
export function getMonthName(date) {
  if (!date) return ''
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]
  return months[dayjs(date).month()]
}
