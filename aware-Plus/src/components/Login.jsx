import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../client";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {

        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        console.log(data);
        if (error) console.error(error);

        if (data){
            navigate('/myProfile');
        }
        
    }

    return (
        <div>
            <form onSubmit={(e) => {e.preventDefault(); handleLogin(email, password)}}>
                <h3>Login</h3>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                {/* <button onClick={() => handleSignUp(email, password)}>Sign Up</button> */}
                <p>Don't have an Account?<Link to="/signup"> Sign Up</Link></p>
            </form>

        </div>
    )
}

export default Login