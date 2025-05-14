import ResponsiveNavLink from "@/Components/ResponsiveNavLink"

const SubNavigaiton = ({ data, route_styles, container_styles }) => {
    

    return (
        <div className={`flex flex-wrap gap-3 justify-center items-center sm:justify-start p-4 border-slate-200 border-b-2 ${container_styles}`}>
            {data.map((path, i) => (
                <div className={`${route_styles}`}>
                    <ResponsiveNavLink 
                        href={route(`${path.route}`)}
                        active={route().current(`${path.route}`)}
                        key={i}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                    >
                        {path.name}
                    </ResponsiveNavLink>
                </div>
            ))}
        </div>
    )
}

export default SubNavigaiton;