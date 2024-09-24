import c from "classnames";
import {useTheme} from "contexts/use-theme";
import {usePokemon, usePokemonList, useTextTransition} from "hooks";
import {useState} from "react";
import {randomMode} from "utils/random";
import {Button} from "./button";
import {LedDisplay} from "./led-display";

import "./pokedex.css";
import {usePokemonTypeList} from "../hooks/use-pokemon-list.ts";

export function Pokedex() {
    const {theme} = useTheme();
    const {ready, resetTransition} = useTextTransition();
    const {pokemonList} = usePokemonList();
    const {pokemonTypeList} = usePokemonTypeList()
    const [i, setI] = useState(0);
    const {pokemon: selectedPokemon} = usePokemon(pokemonList[i]);
    const {pokemon: nextPokemon} = usePokemon(pokemonList[i + 1]);

    const prev = () => {
        resetTransition();
        if (i === 0) {
            setI(pokemonList.length - 1);
        } else {
            setI((i) => i - 1);
        }
    };

    const next = () => {
        resetTransition();
        if (i === pokemonList.length - 1) {
            setI(0);
        } else {
            setI((i) => i + 1);
        }
    };

    // Obtener los tipos del Pokémon seleccionado
    const types = selectedPokemon?.types.map((typeInfo) => typeInfo.type.name) || [];
    return (
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
                    <div
                        className={c(
                            "name",
                            "obfuscated",
                            ready && "ready",
                            ready && `ready--${randomMode()}`
                        )}
                    >
                        {selectedPokemon?.name}
                    </div>
                </div>
                {/* Sección para mostrar los tipos */}
                <div className="types-display">
                    {types.map((type) => (
                        <span key={type} className={c("type-badge", type)}>
                          {type}
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
                </div>
            </div>
        </div>
    );
}
