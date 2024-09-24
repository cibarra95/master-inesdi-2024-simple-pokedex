import {useEffect, useState} from "react";

import {DamageRelation, PokemonUri} from "models";

const API_ENDPOINT = "https://pokeapi.co/api/v2/pokemon/";
const API_ENDPOINT_TYPE = `https://pokeapi.co/api/v2/type/`;

type UsePokemonOpts = {
    limit?: number;
};

export function usePokemonList({limit}: UsePokemonOpts = {limit: 42}) {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemonList, setPokemonList] = useState<PokemonUri[]>([]);

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}?limit=${limit}`);
                const data = await response.json();
                setPokemonList(data.results);
            } catch (error) {
                console.error("Error fetching Pokemon list:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemonList();
    }, [limit]);

    return {pokemonList, isLoading};
}

export function usePokemonTypeList({limit}: UsePokemonOpts = {limit: 25}) {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemonTypeList, setPokemonTypeList] = useState<PokemonUri[]>([]);

    useEffect(() => {
        const fetchPokemonTypeList = async () => {
            try {
                const apiResponse = await fetch(`${API_ENDPOINT_TYPE}?limit=${limit}`);
                const data = await apiResponse.json();
                setPokemonTypeList(data.results);
            } catch (error) {
                console.error("Error fetching Pokemon type:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPokemonTypeList();
    }, [limit]);

    return {pokemonTypeList, isLoading};
}

const cache: { [key: string]: DamageRelation } = {}; // Cache para almacenar resultados

export function usePokemonTypeWeakness(urlType: string[]) {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemonWeaknessTypeList, setPokemonWeaknessTypeList] = useState<DamageRelation[]>([]);

    useEffect(() => {
        const fetchWeaknessTypeList = async () => {
            setIsLoading(true);
            try {
                // Filtrar URLs para hacer solo llamadas necesarias
                const urlsToFetch = urlType.filter(url => !cache[url]);

                const responses = await Promise.all(urlsToFetch.map(url => fetch(url)));
                const data = await Promise.all(responses.map(response => response.json()));

                // Almacenar en caché y construir la lista de debilidades
                const weaknesses: DamageRelation[] = data.map(item => {
                    const weaknessData: DamageRelation = {
                        double_damage_from: item.damage_relations.double_damage_from
                    };
                    cache[item.url] = weaknessData; // Guardar en caché
                    return weaknessData;
                });

                setPokemonWeaknessTypeList(prevList => [...prevList, ...weaknesses]); // Agregar nuevas debilidades
            } catch (error) {
                console.error("Error fetching type details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (urlType.length > 0) {
            fetchWeaknessTypeList();
        }
    }, [urlType]);

    return {pokemonWeaknessTypeList, isLoading};
}

