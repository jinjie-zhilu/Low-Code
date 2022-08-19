export function deepcopy(obj: any): any {
    if (obj instanceof Object) {
        const newObj: Object = {}
        if (Array.isArray(obj)) {
            const arr: Array<Object> = []
            obj.forEach(item => {
                arr.push(deepcopy(item))
            })
            return arr
        } else {
            for (const key in obj) {
                const value: Object = obj[key]
                if (typeof value === 'function') {
                    newObj[key] = value.bind(newObj);
                } else if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        newObj[key] = [];
                        value.forEach(item => {
                            newObj[key].push(deepcopy(item));
                        });
                    } else {
                        newObj[key] = deepcopy(value);
                    }
                } else {
                    newObj[key] = value;
                }
            }
        }
        return newObj;
    } else {
        return obj;
    }
}
