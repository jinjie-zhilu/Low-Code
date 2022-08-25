import axios from "axios"
import { dayjs } from "element-plus"
import { baseUrl } from "./config"

export function getRequest(param: string ,sucessF: Function, errorF: Function = (err) => {console.log(err)}): void {
    axios.get(baseUrl + param)
        .then(res => {
            sucessF(res.data)
        })
        .catch(err => {
            if (err)
                errorF(err)
        })
}

export function postRequest(data: any,sucessF: Function, errorF: Function = (err) => { console.log(err) }): void {
    let nowTime = dayjs().format('YYYY-MM-DD HH:mm')
    axios({ 
        method: 'post',
        url: baseUrl,
        data: {
            updateTime: nowTime,
            elements: data.elements,
            canvas: data.canvas
        }
     })
        .then(res => {
            sucessF(res.data)
        })
        .catch(err => {
            if (err)
                errorF(err)
        })
}

export function putRequest(id: number, data: any, sucessF: Function, errorF: Function = (err) => { console.log(err) }): void {
    let nowTime = dayjs().format('YYYY-MM-DD HH:mm')
    axios({
        method: 'put',
        url: baseUrl + `/${id}`,
        data: {
            updateTime: nowTime,
            elements: data.elements,
            canvas: data.canvas
        }
    })
        .then(res => {
            sucessF(res.data)
        })
        .catch(err => {
            if (err)
                errorF(err)
        })
}

export function deleteRequest(id: number, sucessF: Function, errorF: Function = (err) => { console.log(err) }): void {
    axios({
        method: 'delete',
        url: baseUrl + `/${id}`
    })
        .then(res => {
            sucessF(res.data)
        })
        .catch(err => {
            if (err)
                errorF(err)
        })
}