import { useEffect } from "react";
import useGameAPI from "./useGameAPI";

const useGetAllGames = (filters = {}) => {
    const { getAllGames, loading } = useGameAPI();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                await getAllGames(filters);
            } catch (error) {
                console.error("Failed to fetch games:", error);
            }
        };

        fetchGames();
    }, [JSON.stringify(filters)]); // Re-run when filters change

    return { loading };
};

export default useGetAllGames;