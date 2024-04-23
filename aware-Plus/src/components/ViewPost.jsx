import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {supabase} from '../client.js';

const ViewPost = () => {

    const {id} = useParams();
    const [post, setPost] = useState({created_at: null, id: null, title: "", text: "", image_url: "", video_url: ""});

    useEffect(() => {

        const fetchPost = async () => {

            const {data} = await supabase
                .from('posts')
                .select()
                .eq('id', id);
            
            if (data && data.length > 0){
                setPost(data[0]);
            }
        }
        fetchPost();
    }, [id])

    function renderVideo(url) {

        if (url.includes('youtube.com')) {
            const videoId = url.split('v=')[1];
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return <iframe src={embedUrl} frameborder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>;
        }
        else if (url.includes('youtu.be')) {
            const videoId = url.split('/')[3].split('?')[0];
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return <iframe src={embedUrl} frameborder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>;
        }
        else if (url.endsWith('.mp4')){
            return <video controls><source src={url} type="video/mp4"/></video>;
        }
    }

    return (
        <div>
            <p>{post.created_at}</p>
            <h2>{post.title}</h2>
            <p>{post.text}</p>
            {post.image_url && <img src={post.image_url}/>}
            {post.video_url && renderVideo(post.video_url)}
            {/* {post.video_url && <video controls><source src={post.video_url} type="video/mp4"/></video>} */}
        </div>
    )
}

export default ViewPost