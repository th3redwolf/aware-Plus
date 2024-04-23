import React, {useEffect, useState} from "react";
import {supabase} from '../client.js';
import {Link} from "react-router-dom";
import { useParams } from "react-router-dom";

const DisplayPosts = () => {

    const [posts, setPosts] = useState([]);
    const {id} = useParams();


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
                <div className="each-post" key={post.id}>
                    <Link to={`/view-post/${post.id}`}>
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

