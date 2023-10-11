import * as bcrypt from 'bcrypt';
import { createCipheriv } from "crypto";
import { DateOperation, SqlType } from "./Enums";



export class Utils {

    private static instance: Utils
    public static getInstance(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils()
        }
        return Utils.instance
    }

    getFillNumber(value: number) {
        return `0${value}`.slice(-2)
    }


    async encryptPassword(pass: string): Promise<string> {
        const saltOrRounds = 10;
        return bcrypt.hash(pass, saltOrRounds)

    }


    getReadingDate(date: string) {
        const day = date.substring(6)
        const month = date.substring(4, 6)
        const year = date.substring(0, 4)
        return new Date(`${year}/${month}/${day}`)
    }

    async encrypt(password: string): Promise<string> {

        const padSize = 16 - (((password.length + 16 - 1) % 16) + 1)
        const data = String.fromCharCode(padSize)
        const cipher = createCipheriv('aes-128-cbc', 'G!P@4#1$1%M4SC4D', 'C#&UjO){QwzFcsPs')
        cipher.setAutoPadding(false)
        let pass = password + data.repeat(padSize)
        let enc = cipher.update(pass, 'utf8', 'base64')

        return enc + cipher.final('base64')
    }


    async compareObjects(first: any, second: any) {

        let fistObject = Object.getOwnPropertyNames(first)
        let secondObject = Object.getOwnPropertyNames(second)

        if (fistObject.length != secondObject.length) {
            return false
        }

        for (const element of fistObject) {

            let propName = element

            if (first[propName] !== second[propName]) {
                return false
            }
        }

        return true
    }

    strToDate(str: string) {
        // dd/mm/yyyy
        let currentValue = str.split('/')
        let day = currentValue[1]
        let month = currentValue[0]
        let year = currentValue[2]
        // mm/dd/yyyy
        return `${day}/${month}/${year}`
    }

    dateDbToDate(str: string) {
        // yyyy-mm-dd

        let currentValue = str.split('-')
        let day = currentValue[2]
        let month = currentValue[1]
        let year = currentValue[0]
        return `${month}/${day}/${year}`
    }



    getDate(date: Date, type: SqlType) {

        let day = `${date.getDate()}`.length == 1 ? `0${date.getDate()}` : `${date.getDate()}`
        let month = `${date.getMonth() + 1}`.length == 1 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
        let year = date.getFullYear()

        if (type == SqlType.SQL) {
            return `${year}${month}${day}`
        } else if (type == SqlType.BR) {
            return `${day}/${month}/${year}`
        }
        return `${year}-${month}-${day}`

    }

    getHour(date: Date) {

        let second = `${date.getSeconds()}`.length == 1 ? `0${date.getSeconds()}` : date.getSeconds()
        let minutes = `${date.getMinutes()}`.length == 1 ? `0${date.getMinutes()}` : date.getMinutes()
        let hours = `${date.getHours()}`.length == 1 ? `0${date.getHours()}` : date.getHours()


        return `${hours}:${minutes}:${second}`

    }


    operationWithDate(value: string, dateOperation: DateOperation) {

        const elements = value.split('/')
        const currentDate = new Date(`${elements[1]}/${elements[0]}/${elements[2]}`)
        let newDate = currentDate
        if (dateOperation == DateOperation.ADD) {
            return new Date(newDate.setDate(currentDate.getDate() + 1))
        } else {
            return new Date(newDate.setDate(currentDate.getDate() - 1))
        }
    }

    getPeriod(value: string) {
        const currentValue = value.split('/')

        let firstDate = new Date(Number(currentValue[1]), Number(currentValue[0]) - 1, 1)
        let lastDate = new Date(Number(currentValue[1]), Number(currentValue[0]), 0)

        return {
            firstDate,
            lastDate
        }

    }

    serialAdjusting(str: string) {

        const firstStep = str.replace(/\s/g, '')
        const secondStep = firstStep.replace('-', '')
        const uper = secondStep.toUpperCase()
        return uper.trim()

    }

    getListWithItemsWithoutRepeating(genericList: any[]) {
        let uniqueList = []
        for (let iten of genericList) {
            const isMatch = uniqueList.some(function (element, index) {
                return element === iten
            })
            if (uniqueList.length == 0) {
                uniqueList.push(iten)
            } else {
                if (!isMatch) {
                    uniqueList.push(iten)
                }
            }
        }
        return uniqueList
    }

}