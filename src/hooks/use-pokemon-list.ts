import {useEffect, useState} from "react";

import {PokemonUri} from "models";

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

type weakness = string | string[]

// TODO hacer una integracion que sea mediante llamada a la api directa
export function usePokemonTypeWeakness(type: weakness) {
    const [isLoading, setIsLoading] = useState(true);
    const [weaknessTypes, setWeaknessTypes] = useState<PokemonUri[]>([]);

    useEffect(() => {
        const fetchWeaknessTypeList = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT_TYPE}${type}/`);
                const data = await response.json();
                // Extraer las debilidades de los tipos
                const weaknesses = data.damage_relations.double_damage_from;
                setWeaknessTypes(weaknesses);
            } catch (error) {
                console.error("Error fetching type details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeaknessTypeList();
    }, [type]);

    return {weaknessTypes, isLoading};
}

export function usePokemonSameType(type: string) {
    const [isLoading, setIsLoading] = useState(true); // Cambia el estado inicial a true
    const [pokemonSameType, setPokemonSameType] = useState<PokemonUri[]>([]);

    useEffect(() => {
        const fetchPokemonTypeList = async () => {
            setIsLoading(true); // Asegúrate de establecer isLoading en true al inicio de la carga
            try {
                const response = await fetch(`${API_ENDPOINT_TYPE}${type}/`);
                const data = await response.json();
                console.log(data.pokemon);
                // Cambia a data.pokemon para obtener los Pokémon de ese tipo
                setPokemonSameType(data.pokemon);
            } catch (error) {
                console.error("Error fetching Pokémon by type:", error);
            } finally {
                setIsLoading(false); // Cambia el estado de carga al finalizar
            }
        };

        fetchPokemonTypeList();
    }, [type]);

    return {pokemonSameType, isLoading};
}


