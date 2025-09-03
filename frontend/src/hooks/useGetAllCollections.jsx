import { useEffect } from "react";
import useScenarioCollectionAPI from "./useScenarioCollectionAPI";

const useGetAllCollections = (filters = {}) => {
    const { getAllCollections, loading } = useScenarioCollectionAPI();

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                await getAllCollections(filters);
            } catch (error) {
                console.error("Failed to fetch collections:", error);
            }
        };

        fetchCollections();
    }, [JSON.stringify(filters)]); // Re-run when filters change

    return { loading };
};

export default useGetAllCollections;