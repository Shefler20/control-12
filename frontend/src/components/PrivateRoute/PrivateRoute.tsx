import {type PropsWithChildren} from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {userSelector} from "../../features/users/usersSelectors.ts";



interface Props extends PropsWithChildren{
    isAllowed: boolean | null;
}

const PrivateRoute: React.FC<Props> = ({isAllowed, children}) => {
    const user = useAppSelector(userSelector);
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }


    return <>{children}</>;
};

export default PrivateRoute;