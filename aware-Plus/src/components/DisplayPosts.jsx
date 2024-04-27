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
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState()

    const {id} = useParams();

    useEffect(() => {

        const fetchPosts = async () => {

            const {data: postsData} = await supabase
                .from('posts')
                .select()
                .order('created_at', {ascending: false});
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

    const handleSearch = e => {
        setSearch(e);
    }

    const handleSort = (e) => {

        setSortBy(e);
        let sortedPosts;
        if (e === 'date') {
            sortedPosts = [...posts].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        }
        else if (e === 'upvotes') {
            sortedPosts = [...posts].sort((a,b) => b.upvotes - a.upvotes);
        }
        setPosts(sortedPosts);
    }

     const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="display-posts">
            <div className="search-bar">
                <label htmlFor="Search" className="visually-hidden">Search Posts by Title</label>
                <input
                    type="text"
                    placeholder="Search Posts by Title .."
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <select onChange={(e) => handleSort(e.target.value)}>
                    <option value="date">Sort by Date</option>
                    <option value="upvotes">Sort by Upvotes</option>
                </select>
            </div>
            <div>
                {filteredPosts && filteredPosts.length > 0 ?
                    filteredPosts.map((post, index) => (
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
                                        <p><img className="comment-count-img" src={comment_icon} /> {post.commentsCount}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )) :
                    posts && posts.length > 0 ?
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
                                            <p><img className="comment-count-img" src={comment_icon} /> {post.commentsCount}</p>
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

