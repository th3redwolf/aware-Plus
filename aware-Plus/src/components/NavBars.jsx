import React, {useState} from "react";
import {Link} from "react-router-dom";
import home from "../../home-icon.png";
import burger_menu from "../../burger-menu.png";

const HeaderBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="header-bar">
            <header>
                <nav className="header-nav">
                    <button onClick={() => setIsOpen(!isOpen)}><img className="burger-menu" src={burger_menu}/></button>
                    {isOpen && (
                        <div className={`side-nav ${isOpen ? 'open' : ''}`}>
                            <nav>
                                <div>
                                    <Link to="/">Home Feed</Link>
                                </div>
                                <div>
                                    <Link to="/create">Create Post</Link>
                                </div>
                                <div>
                                    <Link to="/myAccount">My Account</Link>
                                </div>
                            </nav>
                        </div>
                    )}
                    <div>
                        <Link to="/">
                            <div className="header-home-button">
                                <img className="home-icon" alt="home button" src={home} />AwarePlus
                            </div>
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