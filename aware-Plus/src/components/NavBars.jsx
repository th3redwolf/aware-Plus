import React from "react";
import {Link} from "react-router-dom";
import home from "../../home-icon.png";

const HeaderBar = () => {

    return (
        <div className="header-bar">
            <header>
                <nav className="header-nav">
                    <div className="header-home">
                        <Link to="/">
                        <img className="home-icon" alt="home button" src={home}/>AwarePlus
                        </Link>
                    </div>
                    <div className="search-bar">
                        <label htmlFor="Search" className="visually-hidden">Search awarePlus</label>
                        <input
                            type="text"
                            placeholder="Search awarePlus"
                            onChange={(e) => search(e.target.value)}
                        />
                    </div>
                    <div className="header-login">
                        <Link>
                            Log In
                        </Link>
                    </div>
                </nav>
            </header>
        </div>
    )
}

const SideNav = () => {

    return (
        <div className="side-nav">
            <nav>
                <div>
                    <Link to="/">
                        Home Feed
                    </Link>
                </div>
                <div>
                    <Link to="/create">
                        Create Post
                    </Link>
                </div>
                <div>
                    <Link to="/myAccount">
                        My Account
                    </Link>
                </div>
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