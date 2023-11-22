import { useEffect, useRef } from 'react';

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

type StateObject = { [key: string]: any };

function useDynamicCodeAnalysis(props: any, states: StateObject) {
    const prevProps = usePrevious(props);
    const prevStates = usePrevious(states);
    const renderCount = useRef(0);
    const lastWarningTime = useRef(performance.now());
    const stateChangeCount = useRef(0);
    const propChangeCount = useRef(0);
    const lastStateChangeTime = useRef(performance.now());
    const lastPropChangeTime = useRef(performance.now());

    useEffect(() => {
        renderCount.current++; // Increment render count on each render

        const now = performance.now();
        if (now - lastWarningTime.current >= 5000) { // 5-second window
            if (renderCount.current > 3) { // Threshold for re-render warnings
                console.log('Warning: Multiple re-renders detected in the last 5 seconds. Consider optimizing your component.');
            }
            renderCount.current = 0; // Reset render count
            lastWarningTime.current = now;
        }
    }, [states, props]);

    // Check for frequent unnecessary state changes
    useEffect(() => {
        let stateChanges = 0;

        if (prevStates) {
            for (const key in states) {
                if (states[key] !== prevStates[key]) {
                    stateChanges++;
                }
            }
        }

        if (stateChanges > 0) {
            stateChangeCount.current++;
            const now = performance.now();
            if (now - lastStateChangeTime.current >= 5000) {
                if (stateChangeCount.current > 3) {
                    console.log('Warning: Multiple unnecessary state changes detected.');
                }
                stateChangeCount.current = 0;
                lastStateChangeTime.current = now;
            }
        }
    }, [states]);

    // Check for frequent unnecessary prop changes
    useEffect(() => {
        if (JSON.stringify(prevProps) !== JSON.stringify(props)) {
            propChangeCount.current++;
            const now = performance.now();
            if (now - lastPropChangeTime.current >= 5000) {
                if (propChangeCount.current > 10) {
                    console.log('Warning: Multiple unnecessary prop changes detected.');
                }
                propChangeCount.current = 0;
                lastPropChangeTime.current = now;
            }
        }
    }, [props]);


    // Memory Usage
    useEffect(() => {
        const performanceAny = performance as any;
        if (performanceAny.memory) {
            const memoryUsage = performanceAny.memory.usedJSHeapSize;
            console.log('Memory usage:', memoryUsage);

            const memoryThreshold = 50000000;
            if (memoryUsage > memoryThreshold) {
                console.log('Recommendation: Memory usage is high. Investigate potential memory leaks.');
            }
        }
    }, []);
}

export default useDynamicCodeAnalysis;
