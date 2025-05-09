import { catchError } from "../utils/error-response.js";


export const SuperAdminGuard = (req, res, next) => {
    try {
        const superadmin = req?.user;
        if(superadmin || superadmin.role === 'superadmin'){
            return next();
        } else {
            return catchError(res, 403, 'Forbiddin role');
        }
    } catch (error){
        return catchError(res, 500, error.message);
    }
}