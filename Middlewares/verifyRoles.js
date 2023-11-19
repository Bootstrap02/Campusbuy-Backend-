const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.roles || req.roles.length === 0) {
                return res.sendStatus(403);
            }

            const rolesArray = [...allowedRoles];
            const result = req.roles.some(role => rolesArray.includes(role));

            if (!result) {
                return res.sendStatus(401);
            }

            next();
        } catch (error) {
            console.error(error);
            res.sendStatus(500); // Internal Server Error
        }
    };
};

module.exports = verifyRoles;
