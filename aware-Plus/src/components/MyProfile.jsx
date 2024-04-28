import React, {useEffect, useState} from "react";
import {supabase} from '../client.js';
import { useParams, useNavigate } from "react-router-dom";
import loading from '../../loading.gif';

const MyProfile = () => {

    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    // const user = supabase.auth.user;
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        }
        fetchUser();
    }, [])

    if (isLoading) {
        return <div><img src={loading}/></div>
    }

    const handleSignOut = async () => {

        const {error} = await supabase.auth.signOut();
        if (error) console.error(error);

        navigate('/login');
    }

    const handleFileUpload = async (event) => {

        setUploading(true);
        const file = event.target.files[0];
        const filePath = `${user.id}/${file.name}`;

        let {error: uploadError} = await supabase.storage
            .from('profile-pictures')
            .upload(filePath, file);

        if (uploadError) {
            console.error(uploadError);
            return;
        }

        let {error: insertError} = await supabase
            .from('profiles')
            .upsert({id: user.id, avatar_filename: file.name});

        if (insertError) {
            console.error(insertError);
            return;
        }

        let {data: url, error: urlError} = await supabase.storage
            .from('profile-pictures')
            .createSignedUrl(filePath, 60);

        if (urlError) {
            console.error(urlError);
            return;
        }

        setAvatarUrl(url);
        setUploading(false);
    }

    return (
        <div>
            <h1>Welcome, {user ? user.email : 'Loading...'}</h1>
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading}/>
            {avatarUrl && <img src={avatarUrl} alt="Avatar"/>}
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    )
}

export default MyProfile