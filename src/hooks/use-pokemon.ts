import type {Pokemon, PokemonUri} from "models";
import {useEffect, useState} from "react";

const cache = new Map<string, Pokemon>();

export function usePokemon(pokemonUri: PokemonUri) {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemon, setPokemon] = useState<Pokemon>();

    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                const response = await fetch(pokemonUri.url);
                const data = await response.json();
                console.log(data);
                cache.set(pokemonUri.url, data);
                setPokemon(data);
            } catch (error) {
                console.error("Error fetching Pokemon:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!pokemonUri) return;

        if (cache.has(pokemonUri.url)) {
            setPokemon(cache.get(pokemonUri.url));
            setIsLoading(false);
        } else {
            fetchPokemonData();
        }
    }, [pokemonUri]);

    return {pokemon, isLoading};
}
