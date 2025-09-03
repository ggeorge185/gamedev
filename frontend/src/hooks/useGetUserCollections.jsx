import { useEffect } from "react";
import useScenarioCollectionAPI from "./useScenarioCollectionAPI";

const useGetUserCollections = () => {
    const { getUserCollections, loading } = useScenarioCollectionAPI();

    useEffect(() => {
        const fetchUserCollections = async () => {
            try {
                await getUserCollections();
            } catch (error) {
                console.error("Failed to fetch user collections:", error);
            }
        };

        fetchUserCollections();
    }, []);

    return { loading };
};

export default useGetUserCollections;