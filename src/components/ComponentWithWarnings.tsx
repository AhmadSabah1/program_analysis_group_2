import React, { useState, useEffect } from 'react';
import useDynamicCodeAnalysis from "../context/useDynamicCodeAnalysis";

const ComponentWithWarnings: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [toggle, setToggle] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<number>(0); // State to trigger unnecessary re-renders

    // Use the analysis hook
    useDynamicCodeAnalysis({}, { count, toggle, trigger });

    // Effect to cause unnecessary re-renders
    useEffect(() => {
        const interval = setInterval(() => {
            setTrigger(prevTrigger => prevTrigger + 1); // This will cause frequent re-renders
        }, 10); // Interval set to 10ms for demonstration

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Component With Warnings</h2>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment Count</button>
            <p>Toggle state is {toggle ? 'ON' : 'OFF'}</p>
            <button onClick={() => setToggle(!toggle)}>Toggle</button>
        </div>
    );
}

export default ComponentWithWarnings;
