import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'

function SignIn({ setIsAuthenticated }) {
  const [phone, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.setItem('userPhone',phone)
    localStorage.setItem('userEmail',email)
    alert('Login successful')

try {
      const response = await fetch('http://localhost:5000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true); 
      navigate('/');  // Redirect to home after login
    } else {
      alert(data.message);
setError(data.message || 'Invalid credentials');
    }
  
} catch (err) {
  setError('Something went wrong. Please try again.');
}


  };

  return (
    <form onSubmit={handleLogin}>
      <input type="text" value={phone} onChange={(e) => setMobile(e.target.value)} placeholder="Enter Mobile Number" required/>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default SignIn;


// function SignIn({onLogin}) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [activeTab, setActiveTab] = useState('signin');
//   const { register, handleSubmit, formState: { errors } } = useForm();

//   Handle form submission using React Hook Form
//   const Submit = async (data) => {
//     const { email, password } = data;
    
//     try {
//       Send POST request to backend SignIn API
//       const response = await axios.post('http://localhost:5000/signin36', { email, password });
      
//       If SignIn is successful, show success alert
//       alert(response.data.message);
//     } catch (error) {
//       // If there's an error (e.g., invalid credentials), show error alert
//       if (error.response && error.response.data.message) {
//         alert(error.response.data.message); // Backend error message
//       } else {
//         alert('Something went wrong. Please try again.'); // Generic error message
//       }
//     }
//   };

  

//   return (
//     <div className="signin-container">
//       <div className="signin-header">
//         <h2>Sign in to account</h2>
//         <p>Enjoy the fly and passion of investing</p>
//       </div>
//       <div className="tabs">
//         <button
//           className={activeTab === 'signin' ? 'active' : ''}
//           onClick={() => setActiveTab('signin')}
//         >
//           Sign in
//         </button>
//         <button
//           className={activeTab === 'signup' ? 'active' : ''}
//           onClick={() => setActiveTab('signup')}
//         >
//           Sign up
//         </button>
//       </div>

//       {activeTab === 'signin' && (
//         <form className="signin-form" onSubmit={handleSubmit(Submit)}>
//           <label>Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             autoComplete="username"  
//             {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' } })}
//             // value={email}
//             // onChange={(e) => setEmail(e.target.value)} 
//           />
//           {errors.email && <span className="error-message">{errors.email.message}</span>}
          
//           <label>Password</label>
//           <input
//             type="password"
//             // value={password}
//             placeholder="Enter your password"
//              autoComplete="current-password"
//             // onChange={(e) => setPassword(e.target.value)} 
//             {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } })}
//           />
//           {errors.password && <span className="error-message">{errors.password.message}</span>}

//           <button type="submit" className="signin-button">Sign in</button>
//           <a href="#" className="forgot-password">Forgot the password?</a>
//         </form>
//       )}

//       {activeTab === 'signup' && (
//         <div>
//           {/* You can implement signup form here */}
//           <p>Sign up form will go here...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SignIn;









// function SignIn() {
//   const [activeTab, setActiveTab] = useState('signin');
  

//   return (
//     <div className="signin-container">
//       <div className="signin-header">
//         <h2>Sign in to account</h2>
//         <p>Enjoy the fly and passion of investing</p>
//       </div>
//       <div className="tabs">
//         <button
//           className={activeTab === 'signin' ? 'active' : ''}
//           onClick={() => setActiveTab('signin')}
//         >
//           Sign in
//         </button>
//         <button
//           className={activeTab === 'signup' ? 'active' : ''}
//           onClick={() => setActiveTab('signup')}
//         >
//           Sign up
//         </button>
//       </div>
//       <form className="signin-form">
//         <label>Email</label>
//         <input type="email" placeholder="Enter your email" />
//         <label>Password</label>
//         <input type="password" placeholder="Enter your password" />
//         <button type="submit" className="signin-button">Sign in</button>
//         <a href="#" className="forgot-password">Forgot the password?</a>
//       </form>
//     </div>
//   );
// }

// export default SignIn;
