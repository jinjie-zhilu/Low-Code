/**
 * 函数节流
 * @param {function} fn 函数
 * @param {number} t 间隔时间（毫秒）
 * @return {function}
 */
export default function throttle(fn: Function, t: number = 200) {
    let flag: boolean = true
    return function (...args) {
        if (flag) {
            fn.apply(this, args)
            flag = false
            setTimeout(() => {
                flag = true
            }, t)
        }
    }
}