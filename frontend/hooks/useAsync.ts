
import { useEffect, useState, useCallback } from "react";

const useAsync = <ReturnType>(asyncFunction: ()=> Promise<ReturnType>, imediate = true): {
    execute: ()=> void 
    loading: boolean, 
    result: ReturnType| null, 
    error: any,
    refetch: ()=> void 
} => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ReturnType| null>( null);
    const [error, setError] = useState(null);
    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(async () => {
      setLoading(true);
      setResult(null);
      setError(null);
      try {
        const res : ReturnType = await asyncFunction();
        setResult(res);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }, [asyncFunction]);
    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    useEffect(() => {
      if(imediate) {
        execute();      
      }        
    }, [imediate]);
    return { execute, loading, result, error, refetch: ()=> execute()};
  };


  export default useAsync;