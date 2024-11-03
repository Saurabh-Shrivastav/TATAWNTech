import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'

const SignUp = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        localStorage.setItem('userPhone',phone)
        alert('Signup successful')

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const mobileRegex = /^[6-9]\d{9}$/;


        try {
            const response = await fetch('https://tatawntech-g9is.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword,
                    phone
                }),
            });

            const data = await response.json();
            console.log(data);


            if (response.ok) {
                navigate('/signin');  // Redirect to login page after successful signup
            } else {
                setError(data.message || 'Error during signup');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className='signinContainer'>
            {!otpSent ? (

                <form onSubmit={handleSignup}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {error.email && <p style={{ color: 'red' }}>{error.email}</p>}
                    <input
                        type="text"
                        placeholder="Mobile number"
                        value={phone}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                    {error.phone && <p style={{ color: 'red' }}>{error.phone}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error.password && <p style={{ color: 'red' }}>{error.password}</p>}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error.confirmPassword && <p style={{ color: 'red' }}>{error.confirmPassword}</p>}


                    <button type="submit" id='signup'>Signup</button>
                </form>
            ) : (
                <form>
                    <input
                        type='text'
                        placeholder='Enter OTP'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    {error.otp && <p style={{ color: 'red' }}>{error.otp}</p>}

                    <button type='submit'>Verify OTP</button>
                </form>
            )

            }


        </div>
    );
};

export default SignUp;
