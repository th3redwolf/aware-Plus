import React, {useState} from "react";
import {supabase} from "../client";
import {useNavigate} from "react-router-dom";
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import DOMpurify from 'dompurify';

const CreatePost = () => {

    const [post, setPost] = useState({title: "", text: "", image_url: "", video_url: "", username: ""});
    const navigate = useNavigate();

    const handleChange = (event) => {

        const {id, value} = event.target;
        const sanitizedValue = id === 'text' ? DOMpurify.sanitize(value) : value;
        setPost((prev) => {
            return {
                ...prev, [id]:sanitizedValue,
            }
        })
    }

    const createPost = async (event) => {

        event.preventDefault();

        const {data: {user}} = await supabase.auth.getUser();
        const username = user.email.split('@')[0];

        if (user) {
            const { data, error } = await supabase
                .from('posts')
                .insert({ title: post.title, text: post.text, image_url: post.image_url, video_url: post.video_url, user_id: user.id, username: username })
                .select();

            if (data) {
                navigate(`/view-post/${data[0].id}`);
            }
            else {
                console.error(error);
            }
        }
        else {
            alert("You need to Login or Sign Up before you can create a post.");
            return;
        }
    }

    return (
        <div>
            <h1 className="create-new-post">Create a new Post</h1> <br/>
            <form onSubmit={createPost}>
                <label htmlFor="title">Title</label> <br/>
                <input type="text" id="title" onChange={handleChange}/> <br/>

                <label htmlFor="text">Text</label> <br/>
                <ReactQuill onChange={value => handleChange({target: {id: 'text', value}})}/> <br/>
                {/* <textarea rows="5" cols="50" id="text" onChange={handleChange}></textarea> <br/> */}

                <label htmlFor="image_url">Image URL</label> <br/>
                <input type="text" id="image_url" onChange={handleChange}/> <br/>

                <label htmlFor="video_url">Video URL</label> <br/>
                <input type="text" id="video_url" onChange={handleChange}/> <br/>

                <input type="submit" value="Post"/>

            </form>
        </div>
    )
}

export default CreatePost