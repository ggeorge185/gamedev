import { useEffect } from "react";
import useGameAPI from "./useGameAPI";

const useGetUserGames = () => {
    const { getUserGames, loading } = useGameAPI();

    useEffect(() => {
        const fetchUserGames = async () => {
            try {
                await getUserGames();
            } catch (error) {
                console.error("Failed to fetch user games:", error);
            }
        };

        fetchUserGames();
    }, []);

    return { loading };
};

export default useGetUserGames;