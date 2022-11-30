import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import "../App.css";



function TextUpdaterNode({ data, id }) {
    const [label, setLabel] = useState(data.label);
    const onChange = useCallback((evt) => {
        setLabel(evt.target.value);
    }, []);
    return (
        <>
            <Handle
                id={id}
                type="target"
                position={Position.Top}
            />
            <form
                className="text-updater-node"
                id={id}
            >
                <textarea
                    id="text"
                    rows="3"
                    value={label}
                    onChange={onChange}
                    />

            </form>
            <Handle
                type="source"
                position={Position.Bottom}
                id={id}
            />
        </>
    );
}

export default TextUpdaterNode;