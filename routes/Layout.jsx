import {Outlet} from 'react-router-dom';
import NavBars from '../src/components/NavBars.jsx';

const Layout = () => {

    return (
        <div>
            <NavBars/>
            <Outlet/>
        </div>
    )
}

export default Layout