import c from "classnames";
import {useTheme} from "contexts/use-theme";
import {usePokemon, usePokemonList, useTextTransition} from "hooks";
import {useEffect, useState} from "react";
import "./pokedex.css";
import {usePokemonSameType, usePokemonTypeList} from "../hooks/use-pokemon-list.ts";
import {randomMode} from "../utils/random.ts";
import {LedDisplay} from "./led-display.tsx";
import {Button} from "./button.tsx";
import {Pokemon, TypeEffectiveness} from "models.ts";

// Definimos el objeto que contiene las efectividades de los tipos
const typeEffectiveness: Record<string, TypeEffectiveness> = {
    normal: {
        weakTo: ['fighting'],
        strongAgainst: []
    },
    fire: {
        weakTo: ['water', 'ground', 'rock'],
        strongAgainst: ['grass', 'ice', 'bug', 'steel']
    },
    water: {
        weakTo: ['electric', 'grass'],
        strongAgainst: ['fire', 'ground', 'rock']
    },
    electric: {
        weakTo: ['ground'],
        strongAgainst: ['water', 'flying']
    },
    grass: {
        weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
        strongAgainst: ['water', 'ground', 'rock']
    },
    ice: {
        weakTo: ['fire', 'fighting', 'rock', 'steel'],
        strongAgainst: ['grass', 'ground', 'flying', 'dragon']
    },
    fighting: {
        weakTo: ['flying', 'psychic', 'fairy'],
        strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel']
    },
    poison: {
        weakTo: ['ground', 'psychic'],
        strongAgainst: ['grass', 'fairy']
    },
    ground: {
        weakTo: ['water', 'ice', 'grass'],
        strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel']
    },
    flying: {
        weakTo: ['electric', 'ice', 'rock'],
        strongAgainst: ['grass', 'fighting', 'bug']
    },
    psychic: {
        weakTo: ['bug', 'ghost', 'dark'],
        strongAgainst: ['fighting', 'poison']
    },
    bug: {
        weakTo: ['fire', 'flying', 'rock'],
        strongAgainst: ['grass', 'psychic', 'dark']
    },
    rock: {
        weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
        strongAgainst: ['fire', 'ice', 'flying', 'bug']
    },
    ghost: {
        weakTo: ['ghost', 'dark'],
        strongAgainst: ['psychic', 'ghost']
    },
    dragon: {
        weakTo: ['ice', 'dragon', 'fairy'],
        strongAgainst: ['dragon']
    },
    dark: {
        weakTo: ['fighting', 'bug', 'fairy'],
        strongAgainst: ['psychic', 'ghost']
    },
    steel: {
        weakTo: ['fire', 'fighting', 'ground'],
        strongAgainst: ['ice', 'rock', 'fairy']
    },
    fairy: {
        weakTo: ['poison', 'steel'],
        strongAgainst: ['fighting', 'dragon', 'dark']
    }
};

// Definimos el tipo para los parámetros que acepta la función
type PokemonType = keyof typeof typeEffectiveness;

// Función para calcular las debilidades basado en los tipos de un Pokémon
function calculateWeaknesses(types: PokemonType[]): string[] {
    const weaknesses = new Set<string>();

    types.forEach((type) => {
        // Aseguramos que el tipo esté definido en typeEffectiveness
        typeEffectiveness[type]?.weakTo.forEach(weakType => weaknesses.add(weakType));
    });

    return Array.from(weaknesses);
}

export function Pokedex() {
    const {theme} = useTheme();
    const {ready, resetTransition} = useTextTransition();
    const {pokemonList} = usePokemonList();
    const {pokemonTypeList} = usePokemonTypeList();
    const [i, setI] = useState(0);
    const {pokemon: selectedPokemon} = usePokemon(pokemonList[i]);
    const {pokemon: nextPokemon} = usePokemon(pokemonList[i + 1]);
    const [team, setTeam] = useState<Pokemon[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);  // Nuevo estado para el tipo seleccionado
    
    usePokemonSameType(selectedType || "");
    const prev = () => {
        resetTransition();
        setI(i === 0 ? pokemonList.length - 1 : i - 1);
    };

    const next = () => {
        resetTransition();
        setI(i === pokemonList.length - 1 ? 0 : i + 1);
    };

    const types = selectedPokemon?.types.map(type => type.type.name) || [];
    const weaknessTypes = calculateWeaknesses(types);

    useEffect(() => {
        localStorage.setItem('pokemonTypesList', JSON.stringify(pokemonTypeList));
    }, [pokemonTypeList]);

    const addPokemonToTeam = (pokemon: Pokemon) => {
        if (team.length < 6) {
            setTeam([...team, pokemon]);
        } else {
            alert("Ya tienes 6 Pokémon en tu equipo");
        }
    };

    const handleTypeClick = (typeName: string) => {
        setSelectedType(typeName);  // Actualizar el estado con el tipo seleccionado
    };

    return (
        <div>
            <div className="all-types-display">
                {pokemonTypeList.map(type => (
                    <Button onClick={() => handleTypeClick(type.name)} label="type" key={type.name}
                            className={c("type-badge", type.name)}>
                        {type.name}
                    </Button>
                ))}
            </div>
            <div className={c("pokedex", `pokedex-${theme}`)}>
                <div className="panel left-panel">
                    <div className="screen main-screen">
                        {selectedPokemon && (
                            <img
                                className={c(
                                    "sprite",
                                    "obfuscated",
                                    ready && "ready",
                                    ready && `ready--${randomMode()}`
                                )}
                                src={selectedPokemon.sprites.front_default}
                                alt={selectedPokemon.name}
                            />
                        )}
                    </div>
                    <div className="screen name-display">
                        <div className={c("name", "obfuscated", ready && "ready", ready && `ready--${randomMode()}`)}>
                            {selectedPokemon?.name}
                        </div>
                    </div>
                    <div className="types-display">
                        {types.map(type => (
                            <span key={type} className={c("type-badge", type)}>
                                {type}
                            </span>
                        ))}
                    </div>
                    <p className="name-display">Weakness Type</p>
                    <div className="all-types-display types-display">
                        {weaknessTypes.map(weakness => (
                            <span key={weakness} className={c("type-badge", weakness)}>
                                {weakness}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="panel right-panel">
                    <div className="controls leds">
                        <LedDisplay color="blue"/>
                        <LedDisplay color="red"/>
                        <LedDisplay color="yellow"/>
                        <LedDisplay color="green"/>
                        <LedDisplay color="purple"/>
                    </div>
                    <div className="screen second-screen">
                        {nextPokemon && (
                            <img
                                className={c(
                                    "sprite",
                                    "obfuscated",
                                    ready && "ready",
                                    ready && `ready--${randomMode()}`
                                )}
                                src={nextPokemon.sprites.front_default}
                                alt={nextPokemon.name}
                            />
                        )}
                    </div>
                    <div className="controls">
                        <Button label="prev" onClick={prev}/>
                        <Button label="next" onClick={next}/>
                        <Button label="add" onClick={() => addPokemonToTeam(selectedPokemon as Pokemon)}/>
                    </div>
                </div>
                <div className="panel side-panel">
                    {team.map(pokemon => (
                        <div key={pokemon.name} className="screen-pokeball">
                            <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
                            <span>{pokemon.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
