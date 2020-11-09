import {dWeight} from "@/unit/dictionary/index";

export const computedWeight = (type, val) => {
    // 0, undefined, null, '', false -> 對 js 來說都是 false，!false -> true，!!false -> !true -> false (!! 是最快速轉換類型的方式)
    const hasType = !!type

    // 有 type 是 type，沒 type 是 val 的值 (e.g. 公斤 | KG)
    const value = type ?? val

    // 有 type 是 type，沒 type 是 key 的值 (e.g. type | val)
    const key = hasType ? 'type' : 'val'

    // 轉換函數 (u -> {type:"公斤",val:"KG"}, ...)
    const computed = unitVal => unitVal[key] === value

    // 取出中文 (computed -> u => computed(u))
    return dWeight.find(computed).type

}