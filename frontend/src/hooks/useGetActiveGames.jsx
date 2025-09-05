import { useEffect } from "react";
import useGameAPI from "./useGameAPI";

const useGetActiveGames = () => {
    const { getActiveGames, loading } = useGameAPI();

    useEffect(() => {
        const fetchActiveGames = async () => {
            try {
                await getActiveGames();
            } catch (error) {
                console.error("Failed to fetch active games:", error);
            }
        };

        fetchActiveGames();
    }, []);

    return { loading };
};

export default useGetActiveGames;