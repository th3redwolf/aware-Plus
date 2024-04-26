import React, {useEffect, useState} from "react";
import {supabase} from '../client.js';
import {Link} from "react-router-dom";
import {formatDistanceToNow} from 'date-fns';
import { useParams } from "react-router-dom";
import video_icon from "../../video-icon.png";
import no_image from "../../no-image.png";
import comment_icon from "../../comment-icon.png";

const DisplayPosts = () => {

    const [posts, setPosts] = useState([]);
    const {id} = useParams();


    useEffect(() => {

        const fetchPosts = async () => {

            const {data: postsData} = await supabase
                .from('posts')
                .select()
                .order('created_at', {ascending: true});
            // setPosts(data);

            const postsAndComments = await Promise.all (

                postsData.map(async (post) => {
                    const {data: commentsData} = await supabase
                        .from('comments')
                        .select('id')
                        .eq('post_id', post.id);
                    
                    return {...post, commentsCount: commentsData.length};
                })
            )
            setPosts(postsAndComments);
        }
        fetchPosts();
    }, [])

    return (
        <div className="display-posts">
            <div>
                {posts && posts.length > 0 ?
                    posts.map((post, index) => (
                        <div className="each-post" key={post.id}>
                            {post.image_url ? (
                                <img className="post-preview" src={post.image_url} />
                            ) : post.vide_url ? (
                                <img className="post-preview" src={video_icon} />
                            ) : (
                                <img className="post-preview-default" src={no_image} />
                            )}
                            <div className="post-details">
                                <Link to={`/view-post/${post.id}`}>
                                    <div className="top-row">
                                        <p className="user-id">User ID</p>
                                        <h4 className="post-date">{formatDistanceToNow(new Date(post.created_at))} ago</h4>
                                    </div>
                                    <h2 className="post-title">{post.title}</h2>
                                    <div className="bottom-row">
                                        <p className="post-upvotes">⬆️ {post.upvotes}</p>
                                        <p><img className="comment-count-img" src={comment_icon}/> {post.commentsCount}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )) :
                    <div>
                        No Posts yet
                    </div>

                }
            </div>
        </div>
        
    )
}

export default DisplayPosts

