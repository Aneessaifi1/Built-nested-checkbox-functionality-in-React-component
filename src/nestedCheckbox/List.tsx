import React, { FC } from 'react'

type ListProps = {
    data: any,
    ancestors: any,
    onChange: any
}
const List: FC<ListProps> = ({ data, ancestors, onChange }) => {
    const prefix = ancestors.join(".");
    return (
        <ul>
            {
                data && data.map((item: any, idx: number) => {
                    const id = `${prefix}.${item?.id}`;
                    let children = null;
                    if (item?.data?.length > 0) {
                        children = (
                            <List
                                data={item.data}
                                onChange={onChange}
                                ancestors={[...ancestors, item?.id]}
                            />
                        )
                    }
                    return (
                        <li key={id}>
                            <div>
                                <input
                                    type="checkbox"
                                    id={item.label}
                                    value={item.id}
                                    onChange={(e) => onChange(e, ancestors)}
                                    checked={item.isChecked}
                                />
                                <label htmlFor={item.label}>{item.label}</label>
                            </div>
                            {
                                children
                            }

                        </li>
                    )
                })
            }
        </ul>
    )
}
export default List