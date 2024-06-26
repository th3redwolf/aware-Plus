import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../client";

const SignUp = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (email, password) => {
        
        const {data, error} = await supabase.auth.signUp({
            email, 
            password,
        })
        if (error) console.error(error);
        if (data){
            navigate('/myProfile');
        }
    }

    return (
        <div>
            <form onSubmit={(e) => {e.preventDefault(); handleSignUp(email, password)}}>
                <h3>Sign Up</h3>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign Up</button>
                <p>Have an Account?<Link to="/login"> Login</Link></p>
            </form>
        </div>
    )
}

export default SignUp