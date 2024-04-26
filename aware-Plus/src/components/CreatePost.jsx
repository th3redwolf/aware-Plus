import React, {useState} from "react";
import {supabase} from "../client";
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import DOMpurify from 'dompurify';

const CreatePost = () => {

    const [post, setPost] = useState({title: "", text: "", image_url: "", video_url: ""});

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
        const {data, error} = await supabase
            .from('posts')
            .insert({title: post.title, text: post.text, image_url: post.image_url, video_url: post.video_url})
            .select();
        
        if (data) {
            window.location = '/';
        }
        else {
            console.error(error);
        }
    }

    return (
        <div>
            <h1 className="create-new-post">Create a new Post</h1> <br/>
            <form>
                <label htmlFor="title">Title</label> <br/>
                <input type="text" id="title" onChange={handleChange}/> <br/>

                <label htmlFor="text">Text</label> <br/>
                <ReactQuill onChange={value => handleChange({target: {id: 'text', value}})}/> <br/>
                {/* <textarea rows="5" cols="50" id="text" onChange={handleChange}></textarea> <br/> */}

                <label htmlFor="image_url">Image URL</label> <br/>
                <input type="text" id="image_url" onChange={handleChange}/> <br/>

                <label htmlFor="video_url">Video URL</label> <br/>
                <input type="text" id="video_url" onChange={handleChange}/> <br/>

                <input type="submit" value="Post" onClick={createPost}/>

            </form>
        </div>
    )
}

export default CreatePost