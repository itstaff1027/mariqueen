
const Button = ({ ...props, styles, name }) => {

    return (
        <button {...props}>
            {name}
        </button>
    )
}
