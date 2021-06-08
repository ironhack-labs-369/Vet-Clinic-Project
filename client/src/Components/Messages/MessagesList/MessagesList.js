import React, { useState, useEffect } from 'react';
import style from './MessagesList.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Filters from '../../Filters/Filters';
import Spinner from '../../UI/Spinner/Spinner';

const MessagesList = () => {
    const [searchField, setSearchField] = useState('');
    const [messagesList, setMessagesList] = useState([]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const messages = await axios.get('/api/messages', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessagesList(messages.data);
        } catch (err) {
            console.log(err.response);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredSearch = messagesList.filter((element) => {
        return (
            `${element.sender.name}`
                .toLowerCase()
                .includes(`${searchField.toLowerCase()}`) ||
            `${element.sender.lastName}`
                .toLowerCase()
                .includes(`${searchField.toLowerCase()}`)
        );
    });

    const displayMessages = filteredSearch.map((message) => {
        return (
            <tr key={message._id} className={style.resultCard}>
                <td style={{ width: '30%' }}>
                    {message.sender.lastName},{message.sender.name}
                </td>
                <td>
                    <Link to={`/messages/${message._id}`}>
                        {' '}
                        {message.address ? 'new request' : 'message'}
                    </Link>
                </td>

                <td>
                    {message.imageUrl && (
                        <img
                            src="../../../images/camera-logo.png"
                            alt="pic-logo"
                            style={{
                                width: '1.5rem',
                            }}
                        />
                    )}
                </td>
            </tr>
        );
    });

    if (!messagesList) return <Spinner />;
    return (
        <div className={style.Container}>
            <div className={style.Card}>
                <Filters handleChange={handleChange} />

                <table style={{ margin: '0 0 10% 5%' }}>
                    <tbody>{displayMessages}</tbody>
                </table>
            </div>
        </div>
    );
};

export default MessagesList;
