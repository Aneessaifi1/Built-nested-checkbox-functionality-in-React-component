import React, { useState, useEffect } from 'react'
import { data } from './data'
import List from './List'
import { cloneDeep } from "lodash";
const NestedCheckbox = () => {
    const [array, setArray] = useState<any>([])

    useEffect(() => {
        const res = recursiveFunc(data, undefined)
        setArray(res)
    }, [])

    // transform data to pass parent data to child 
    const recursiveFunc = (arr: any, parent: any) => {        
        return arr.reduce((acc: any, v: any) => {
            const newObj = { ...v }        
            if (v?.data?.length > 0) {
                const res = recursiveFunc(v?.data, newObj)
                newObj.data = res
                newObj.parent = parent
                acc.push(newObj)
                return acc
            } else {
                newObj.parent = parent
                newObj.data = []
                acc.push(newObj)
                return acc
            }
        }, [])
    }
    // parent check and unchecked
    const updateAncestors = (node: any) => {
        if (!node.parent) {
            return;
        }
        const parent = node.parent;
        if (parent.isChecked && !node.isChecked) {
            parent.isChecked = false;
            updateAncestors(parent);
            return;
        }
        if (!parent.isChecked && node.isChecked) {
            if (parent.data.every((node: any) => node.isChecked)) {
                parent.isChecked = true;
                updateAncestors(parent);
                return;
            }
        }
        return;
    }

     // child check and unchecked
    const toggleDescendants = (node: any) => {
        const checked = node.isChecked;
        node?.data?.forEach((node: any) => {
            node.isChecked = checked;
            toggleDescendants(node);
        })
    }

    // find node by parent id
    const findNode = (arr: any, id: any, ancestors: any) => {
        let node = undefined;
        if (ancestors.length === 0) {
            return arr.filter((node: any) => node.id === id)[0];
        }
        for (let ancestor of ancestors) {
            const candidates: any = node ? node.data : arr;
            node = candidates.filter((node: any) => node.id === ancestor)[0];
        }
        return node?.data.filter((node: any) => node.id === id)[0];
    }

    // onchange value
    const onChange = (e: any, ancestors: any) => {
        const checked = e.currentTarget.checked;
        const node = findNode(array, e.currentTarget.value, ancestors);
        node.isChecked = checked;
        toggleDescendants(node);
        updateAncestors(node);
        setArray(cloneDeep(array))
    }
    return (
        <List
            data={array}
            onChange={onChange}
            ancestors={[]}
        />
    )
}
export default NestedCheckbox