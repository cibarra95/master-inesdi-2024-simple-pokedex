import c from "classnames";
import "./button.css";

type Props = React.ComponentProps<"button"> & {
    label: "prev" | "next" | "add" | "type";
};

export function Button({label, ...rest}: Props) {
    return (
        <button className={c("button", label)} {...rest}>
        </button>
    );
}
