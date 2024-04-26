import React, {useState} from "react";
import {supabase} from "../client";

const CreatePost = () => {

    const [post, setPost] = useState({title: "", text: "", image_url: "", video_url: ""});

    const handleChange = (event) => {

        const {id, value} = event.target;
        setPost((prev) => {
            return {
                ...prev, [id]:value,
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
            <form>
                <label htmlFor="title">Title</label> <br/>
                <input type="text" id="title" onChange={handleChange}/> <br/>

                <label htmlFor="text">Text (optional)</label> <br/>
                <textarea rows="5" cols="50" id="text" onChange={handleChange}></textarea> <br/>

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