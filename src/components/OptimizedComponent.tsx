import React, { useState, useMemo } from 'react';
import useDynamicCodeAnalysis from "../context/useDynamicCodeAnalysis";

const OptimizedComponent: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [toggle, setToggle] = useState<boolean>(false);

    // Use the analysis hook with stable props
    const stableProp = useMemo(() => ({ value: 'stable' }), []);
    useDynamicCodeAnalysis(stableProp, { count, toggle });

    return (
        <div>
            <h2>Optimized Component</h2>
            <p>Count: {count}</p>
            <button onClick={() => setCount(prevCount => prevCount + 1)}>Increment Count</button>
            <p>Toggle state is {toggle ? 'ON' : 'OFF'}</p>
            <button onClick={() => setToggle(current => !current)}>Toggle</button>
        </div>
    );
}

export default OptimizedComponent;
