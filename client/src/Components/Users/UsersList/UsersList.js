import React, { useState, useEffect } from 'react';
import style from './UserList.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Filters from '../../Filters/Filters';
import Spinner from '../../UI/Spinner/Spinner';

const UsersList = (props) => {
    const [usersList, setUsersList] = useState([]);
    const [searchField, setSearchField] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const token = localStorage.getItem('token');

    const fetchData = async () => {
        try {
            const users = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsersList(users.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // console.log('usersList', usersList);

    const handleChange = (event) => {
        if (event.target.type === 'select-one') {
            setSelectedRole(event.target.value);
        } else {
            setSearchField(event.target.value);
        }
    };

    const filteredSearch = usersList.filter((element) => {
        return (
            (`${element.name}`
                .toLowerCase()
                .includes(`${searchField.toLowerCase()}`) ||
                `${element.lastName}`
                    .toLowerCase()
                    .includes(`${searchField.toLowerCase()}`)) &&
            (element.role === selectedRole || !selectedRole)
        );
    });

    const displayUsers = filteredSearch.map((user) => {
        return (
            <tr key={user._id} className={style.resultCard}>
                <td>
                    <Link to={`/users/${user._id}`}>
                        {user.lastName}, {user.name}
                    </Link>
                </td>
                <td>{user.role}</td>
                <td>
                    {user.pets.map((pet) => {
                        switch (pet.specie) {
                            case 'dog':
                                return (
                                    <Link to={`/pets/${pet._id}`} key={pet._id}>
                                        <img
                                            src="../../../../images/dog-logo.png"
                                            alt="dog-logo"
                                            style={{
                                                width: '1.5rem',
                                                paddingRight: '15%',
                                            }}
                                        />
                                    </Link>
                                );
                            case 'cat':
                                return (
                                    <Link to={`/pets/${pet._id}`} key={pet._id}>
                                        <img
                                            src="../../../../images/cat-logo.png"
                                            alt="cat-logo"
                                            style={{
                                                width: '1.5rem',
                                                paddingRight: '15%',
                                            }}
                                        />
                                    </Link>
                                );
                            case 'rodent':
                                return (
                                    <Link to={`/pets/${pet._id}`} key={pet._id}>
                                        <img
                                            src="../../../../images/rodent-logo.png"
                                            alt="rodent-logo"
                                            style={{
                                                width: '1.5rem',
                                                paddingRight: '15%',
                                            }}
                                        />
                                    </Link>
                                );
                            case 'bird':
                                return (
                                    <Link to={`/pets/${pet._id}`} key={pet._id}>
                                        <img
                                            src="../../../../images/bird-logo.png"
                                            alt="bird-logo"
                                            style={{
                                                width: '1.5rem',
                                                paddingRight: '15%',
                                            }}
                                        />
                                    </Link>
                                );
                            case 'reptile':
                                return (
                                    <Link to={`/pets/${pet._id}`} key={pet._id}>
                                        <img
                                            src="../../../../images/reptile-logo.png"
                                            alt="reptile-logo"
                                            style={{
                                                width: '1.5rem',
                                                paddingRight: '15%',
                                            }}
                                        />
                                    </Link>
                                );
                            case 'other':
                                return (
                                    <Link to={`/pets/${pet._id}`} key={pet._id}>
                                        <img
                                            src="../../../../images/other-logo.png"
                                            alt="other-logo"
                                            style={{
                                                width: '1.5rem',
                                                paddingRight: '15%',
                                            }}
                                        />
                                    </Link>
                                );
                            default:
                                return;
                        }
                    })}
                </td>
            </tr>
        );
    });

    const userRoleOptions = (
        <>
            <option value="employee">employee</option>
            <option value="client">client</option>
        </>
    );

    if (!usersList) return <Spinner />;
    return (
        <div className={style.Container}>
            <div className={style.Card}>
                <Filters
                    handleChange={handleChange}
                    userRoleOptions={userRoleOptions}
                />
                <button className={style.Button}>
                    <Link to={'/users/add'}>
                        <span>+</span>
                    </Link>
                </button>
                <table>
                    <tbody>{displayUsers}</tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersList;
