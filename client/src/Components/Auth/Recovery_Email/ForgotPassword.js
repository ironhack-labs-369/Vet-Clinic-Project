import React, { useState } from 'react';
import style from './ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import { Form, Button, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useInput from '../../../utils/useInput';
import axios from 'axios';

const ForgotPassword = (props) => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useInput('');

    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm();

    const sendEmail = ({ email }) => {
        email !== '' &&
            axios
                .post('/api/auth/forgotpassword', { email: email })
                .then((response) => {
                    console.log('response', response);
                    setMessage(response.data.message);
                    setEmail('');
                    setTimeout(() => {
                        props.history.push('/');
                    }, 3000);
                })
                .catch((err) => {
                    console.log(err.response);
                    setMessage(err.response.data.message);
                });
    };

    return (
        <div className={style.Container}>
            <div className={style.Card}>
                <Form className={style.Form} onSubmit={handleSubmit(sendEmail)}>
                    <Form.Group style={{ width: '100%' }}>
                        <label htmlFor="email">Email</label>
                        <FormControl
                            {...register('email', { required: true })}
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={setEmail}
                        />
                        {errors.email && <span>This field is required</span>}
                    </Form.Group>
                    <Form.Text>
                        {' '}
                        <p>
                            A verification code will be sent to your email
                            address.
                            <br />
                            Please verify your email has been entered correctly
                        </p>
                    </Form.Text>
                    {message && (
                        <Form.Text>
                            <span style={{ color: 'blue', fontSize: '1rem' }}>
                                {message}
                            </span>
                        </Form.Text>
                    )}
                    <Button type="submit">Send recovery email</Button>
                </Form>

                <Link to="/"> Back</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
