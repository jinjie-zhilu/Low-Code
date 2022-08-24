import { Store } from "pinia"
import { ElementItem, PublishData } from "./data"


export type CanvasStore = Store<'canvas', {
    bgColor: String,
    width: number,
    height: number,
    zoom: number
    }, {}, {}
    >

export type PublishStore = Store<'publish', {
    list: Array<PublishData>
    }, {}, {}
>

export type ElementsStore = Store<'elements',
    {
        sum: number,
        elements: Array<ElementItem>
    },
    {
        focusElements(): {
            focus: Array<ElementItem>,
            unfocus: Array<ElementItem>
        }
    },
    {
        addElement(component: ElementItem): void,
        clearAll(): void,
        clearFocus(): void,
        move(
            X: number,
            Y: number,
            focus: Array<ElementItem>,
            Pos: {
                top: number,
                left: number
            }[]): void,
        set(elements: Array<ElementItem>): void,
        delete(elements: Array<ElementItem>): void,
        chooseAll(): void
    }
>