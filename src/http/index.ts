import { ElementItem } from "@/interface"
import axios from "axios"
import { dayjs } from "element-plus"
import { baseUrl } from "./config"


export function getRequest(param: string ,sucessF: Function, errorF: Function = (err) => {console.log(err)}): void {
    axios.get(baseUrl + param)
        .then(res => {
            sucessF(res.data[0])
        })
        .catch(err => {
            if (err)
                errorF(err)
        })
}

export function postRequest(data: Array<ElementItem>, sucessF: Function, errorF: Function = (err) => { console.log(err) }): void {
    let nowTime = dayjs().format('YYYY-MM-DD HH:mm')
    axios({ 
        method: 'post',
        url: baseUrl,
        data: {
            updateTime: nowTime,
            elements: data
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
    let nowTime = dayjs().format('YYYY-MM-DD HH:mm')
    axios({
        method: 'delete',
        url: baseUrl,
        params: {
            id: id
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