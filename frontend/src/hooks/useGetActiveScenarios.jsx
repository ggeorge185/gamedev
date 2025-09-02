import { useEffect } from "react";
import useScenarioAPI from "./useScenarioAPI";

const useGetActiveScenarios = () => {
    const { getActiveScenarios, loading } = useScenarioAPI();

    useEffect(() => {
        const fetchActiveScenarios = async () => {
            try {
                await getActiveScenarios();
            } catch (error) {
                console.error("Failed to fetch active scenarios:", error);
            }
        };

        fetchActiveScenarios();
    }, []);

    return { loading };
};

export default useGetActiveScenarios;