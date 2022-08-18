import { Store } from "pinia"
import { ElementItem } from "./data"


export type CanvasStore = Store<'canvas', {
    bgColor: String,
    width: number,
    height: number,
    zoom: number
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
            }[]): void
    }
>