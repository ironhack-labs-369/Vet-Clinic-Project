import React, { useState } from 'react';
import style from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { logout } from '../../utils/auth';
import Login from '../Auth/Login/Login';
// import Logout from '../Auth/Login/Login';
import Signup from '../Auth/Signup/Signup';
import { Navbar as Nav } from 'react-bootstrap';

const Navbar = (props) => {
    const [showForm, setShowForm] = useState(false);

    console.log('user from Nav', props);
    console.log('isEmployee', props.isEmployee);

    const handleLogout = () =>
        logout()
            .then(() => {
                props.setUser(() => '');
                props.history.push('/');
            })
            .catch((err) => {
                console.log(err);
            });

    return (
        <>
            <Nav className={style.Navbar}>
                {!props.user ? (
                    <Login
                        showForm={showForm}
                        setShowForm={setShowForm}
                        setUser={props.setUser}
                        history={props.history}
                    />
                ) : (
                    <ul>
                        <li>
                            <Link to="/users/{{user._id}}">Profile</Link>
                        </li>
                        <li>
                            <button
                                className={style.Button}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                )}
                {props.isEmployee ? (
                    <ul>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                        <li>
                            <Link to="/users/clients">Clients</Link>
                        </li>
                        <li>
                            <Link to="/users/employees">Employees</Link>
                        </li>
                        <li>
                            <Link to="/pets">Patients</Link>
                        </li>
                    </ul>
                ) : (
                    <>
                        <ul>
                            <li>
                                <Link to="#emergencyForm">
                                    Book an appointment
                                </Link>
                            </li>
                        </ul>
                    </>
                )}
            </Nav>
            {showForm && (
                <Signup
                    setUser={props.setUser}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    history={props.history}
                />
            )}
        </>
    );
};

export default Navbar;
