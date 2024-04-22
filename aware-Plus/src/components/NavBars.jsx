import React from "react";
import {Link} from "react-router-dom";

const HeaderBar = () => {

    return (
        <div className="header-bar">
            <header>
                <nav>

                </nav>
            </header>
        </div>
    )
}

const SideNav = () => {

    return (
        <div className="side-nav">
            <nav>

            </nav>
        </div>
    )
}




const NavBars = () => {

    return (
        <div>
            <HeaderBar/>
            <SideNav/>

        </div>
    )
}

export default NavBars