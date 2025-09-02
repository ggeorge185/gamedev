import { useEffect } from "react";
import useScenarioAPI from "./useScenarioAPI";

const useGetAllScenarios = (filters = {}) => {
    const { getAllScenarios, loading } = useScenarioAPI();

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                await getAllScenarios(filters);
            } catch (error) {
                console.error("Failed to fetch scenarios:", error);
            }
        };

        fetchScenarios();
    }, [JSON.stringify(filters)]); // Re-run when filters change

    return { loading };
};

export default useGetAllScenarios;