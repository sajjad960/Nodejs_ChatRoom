import React, { useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { UserContext } from '../../UserContext';


const Navbar = () => {
    const { user, setUser } = useContext(UserContext);

    const logout = () => {
        setUser('')
        localStorage.removeItem('jwt')
        return (
            <Redirect to='/'/>
        )
    }


    return (
        <>
            <nav className="green">
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">Chat</a>
                    <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>

                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/signup'>Signup</Link></li>
                        {
                         user ? <li><a href='/' onClick={logout}>Logout</a></li> : ''
                        }
                    </ul>
                </div>
            </nav>
            <ul class="sidenav" id="mobile-demo">
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/signup'>Signup</Link></li>
                {
                    user ? <li><a href='/' onClick={logout}>Logout</a></li> : ''
                }
                
            </ul>
        </>

    )
}

export default Navbar
