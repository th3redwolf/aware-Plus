import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const HeaderBar = () => {

    const [isOpen, setIsOpen] = useState(false);
    // in case window size below threshhold => side bar converts to burger menu
    useEffect(() => {

        function handleResize() {
            if (window.innerWidth > 700) {
                setIsOpen(false);
            }
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [setIsOpen])

    return (
        <div className="header-bar">
            <header>
                <nav className="header-nav">
                    <button onClick={() => setIsOpen(!isOpen)}><img className="burger-menu" src='/burger-menu.png'/></button>
                    {isOpen && (
                        <div className={`side-nav ${isOpen ? 'open' : ''}`}>
                            <nav>
                                <div>
                                    <Link style={{color: '#2f9ad0'}} to="/">Home Feed</Link>
                                </div> <br/>
                                <div>
                                    <Link style={{color: '#2f9ad0'}} to="/create">Create Post</Link>
                                </div> <br/>
                                <div>
                                    <Link style={{color: '#2f9ad0'}} to="/myProfile">My Profile</Link>
                                </div>
                            </nav>
                        </div>
                    )}
                    <Link to="/">
                        <div className="header-home-button">
                            <img className="home-icon" alt="home button" src='/home-icon.png'/>
                        </div>
                    </Link>
                    <Link className="header-home-button" to="/">Aware+</Link>
                    <div className="search-bar">
                        <label htmlFor="Search" className="visually-hidden">Search awarePlus</label>
                        {/* <input
                            type="text"
                            placeholder="Search awarePlus"
                            onChange={(e) => search(e.target.value)}
                        /> */}
                    </div>
                    <Link to="/login">
                        <div className="header-login">
                            Log In
                        </div>

                    </Link>
                </nav>
            </header>
        </div>
    )
}
// side nav / burger menu
const SideNav = () => {

    return (
        <div className="side-nav">
            <nav>
                <div>
                    <Link style={{color: '#2f9ad0'}} to="/">
                        Home Feed
                    </Link>
                </div> <br/>
                <div>
                    <Link style={{color: '#2f9ad0'}} to="/create">
                        Create Post
                    </Link>
                </div> <br/>
                <div>
                    <Link style={{color: '#2f9ad0'}} to="/myProfile">
                        My Profile
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