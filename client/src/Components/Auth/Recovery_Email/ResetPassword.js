import React, { useState } from 'react';
import style from './ResetPassword.module.css';
import { Form, Button, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useInput from '../../../utils/useInput';
import axios from 'axios';
import { useForm } from 'react-hook-form';
// import { RiArrowGoBackLine as BackArrow } from 'react-icons/ri';

const ResetPassword = (props) => {
    const [message, setMessage] = useState('');

    const [password, setPassword] = useInput('');
    const [confirm, setConfirm] = useInput('');
    const [token] = useState(props.match.params.resettoken);
    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm();

    const onSubmit = ({ password, confirm }) => {
        // event.preventDefault();
        axios
            .put(`/api/auth/resetpassword/${token}`, { password, confirm })
            .then((res) => {
                console.log('response', res.data.message);
                setMessage(res.data.message);
                setTimeout(() => {
                    props.history.push('/');
                }, 3000);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className={style.Container}>
            <div className={style.Card}>
                <Form className={style.Form} onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group style={{ width: '100%' }}>
                        <label htmlFor="password">Password</label>
                        <FormControl
                            {...register('password', { required: true })}
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={setPassword}
                        />
                        {errors.password && <span>This field is required</span>}
                    </Form.Group>
                    <Form.Group style={{ width: '100%' }}>
                        <label htmlFor="confirm">Confirm Password</label>
                        <FormControl
                            {...register('confirm', { required: true })}
                            name="confirm"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirm}
                            onChange={setConfirm}
                        />
                        {errors.confirm && <span>This field is required</span>}
                    </Form.Group>
                    <p style={{ color: '#fff', fontSize: '1rem' }}>{message}</p>
                    <Button type="submit">Reset Password</Button>
                </Form>

                <Link to="/">
                    {' '}
                    {/* <BackArrow style={{ fontSize: '2rem' }} /> */}
                    Back
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;
