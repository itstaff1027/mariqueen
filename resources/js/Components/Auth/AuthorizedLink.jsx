const AuthorizedLink = ({ requiredRoles, children, ...props }) => {
    const { user } = usePage().props.auth;
    // Assuming user.roles is an array of roles
    const isAuthorized = requiredRoles.some(role => user.roles.includes(role));
    return isAuthorized ? <Link {...props}>{children}</Link> : null;
  };
  