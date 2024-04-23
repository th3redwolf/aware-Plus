import React, {useEffect, useState} from "react";
import {supabase} from '../client.js';
import {Link} from "react-router-dom";

const DisplayPosts = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {

        const fetchPosts = async () => {

            const {data} = await supabase
                .from('posts')
                .select()
                .order('created_at', {ascending: true});
            setPosts(data);
        }
        fetchPosts();
    }, [])

    return (
        <div>
            {posts && posts.length > 0 ?
            posts.map((post, index) => (
                <div className="each-post">
                    <Link to="">
                        <h4>{post.created_at}</h4>
                        <h2>{post.title}</h2>
                        <p>⬆️ {post.upvotes}</p>
                    </Link>
                    
                    
                </div>
            )) : 
                <div>
                    No Posts yet
                </div>

            }
        </div>
    )
}

export default DisplayPosts

/* return (
    <div>
        {posts && posts.length > 0 ?
        posts.map((post, index) => (
            <div className="each-post">
                <h2>{post.title}</h2>
                <p>{post.text}</p>
                {post.image_url && <img src={post.image_url} alt={post.title} />}
                {post.video_url && <video controls><source src={post.video_url} type="video/mp4" /></video>}
            </div>
        )) : 
            <div>
                No Posts yet
            </div>
        }
    </div>
)
*/