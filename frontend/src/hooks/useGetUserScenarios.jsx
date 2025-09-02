import { useEffect } from "react";
import useScenarioAPI from "./useScenarioAPI";

const useGetUserScenarios = () => {
    const { getUserScenarios, loading } = useScenarioAPI();

    useEffect(() => {
        const fetchUserScenarios = async () => {
            try {
                await getUserScenarios();
            } catch (error) {
                console.error("Failed to fetch user scenarios:", error);
            }
        };

        fetchUserScenarios();
    }, []);

    return { loading };
};

export default useGetUserScenarios;