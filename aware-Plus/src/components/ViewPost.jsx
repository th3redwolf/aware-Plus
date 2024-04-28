import React, {useState, useEffect, useRef, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {supabase} from '../client.js';
import {formatDistanceToNow} from "date-fns";
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import DOMpurify from 'dompurify';
import edit from '../../edit.png';
import upvote from '../../upvote.png';
import comment_icon from '../../comment-icon.png';
import user_profile from '../../user-profile.png';

const ViewPost = () => {

    const {id} = useParams();
    const [post, setPost] = useState({created_at: null, id: null, title: "", text: "", image_url: "", video_url: "", upvotes: 0, user_id: null, username: ""});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({...post});
    const [showOptions, setShowOptions] = useState(false);
    const [showCommentSubmit, setShowCommentSubmit] = useState(false);

    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const textAreaRef = useRef(null);

    useEffect(() => {

        const fetchPost = async () => {

            const {data} = await supabase
                .from('posts')
                .select()
                .eq('id', id);
            
            if (data && data.length > 0){
                const post = data[0];
                const {data: commentsData} = await supabase
                    .from('comments')
                    .select('id')
                    .eq('post_id', post.id);

                setPost({...post, commentsCount: commentsData.length});
            }
        }
        fetchPost();

        const fetchComments = async () => {

            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', id)
                .order('created_at', {ascending: false});

            if (data) {
                console.log(data);
                setComments(data);
            }
        }
        fetchComments();

        const channel = supabase
            .channel('comments-insert-channel')
            .on(
                'postgres_changes',
                {event: 'INSERT', schema: 'public', table: 'comments'},
                (payload) => {
                    console.log('Change received!', payload);
                    fetchComments();
                }
            )
            .subscribe();

        // unsubscribe when component is unmounted
        return () => {
            channel.unsubscribe();
        }

    }, [id, supabase])

    // user json
    useEffect(() => {

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        fetchUser();
        console.log(user)
    }, [])

    function renderVideo(url) {

        if (url.includes('youtube.com')) {
            const videoId = url.split('v=')[1];
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return <iframe src={embedUrl} style={{border: 'none', width: '100%', maxWidth: '700px', height: '400px'}} allow="autoplay; encrypted-media" allowFullScreen></iframe>;
        }
        else if (url.includes('youtu.be')) {
            const videoId = url.split('/')[3].split('?')[0];
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return <iframe src={embedUrl} style={{border: 'none', width: '100%', maxWidth: '700px', height: '400px'}} allow="autoplay; encrypted-media" allowFullScreen></iframe>;
        }
        else if (url.endsWith('.mp4')){
            return <video controls style={{width: '100%', height: '500px'}}><source src={url} type="video/mp4"/></video>;
        }
    }
    // comment section
    const adjustComment = (event) => {

        if (textAreaRef.current) {
            textAreaRef.current.style.height = "inherit";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }

    const handleChange = (event) => {

        setNewComment(event.target.value);
        setShowCommentSubmit(true);
    }

    const handleComment = () => {
        setShowCommentSubmit(prev => !prev);
    }

    const commentSubmit = async (event) => {

        event.preventDefault();
        const {data} = await supabase
            .from('comments')
            .insert({post_id: id, comment: newComment});
    
        setNewComment('');
        textAreaRef.current.value = "";
        setShowCommentSubmit(prev => !prev);

        setPost(prev => ({...prev, commentsCount: prev.commentsCount + 1}));
    } 

    // edit / update, delete post
    const handleOptions = () => {
        setShowOptions(prevShowOptions => !prevShowOptions);
    }

    const handleEdit = () => {

        if (!user) {
            alert('You must be logged in to edit your post.');
            return;
        }

        if (post.user_id !== user.id) {
            alert("You can only edit your own posts.");
            return;
        }

        setEditedPost({...post});
        setIsEditing(true);
        setShowOptions(false);
    }

    const handleEditing = (event) => {

        const {id, value} = event.target;
        const sanitizedValue = id === 'text' ? DOMpurify.sanitize(value) : value;
        setEditedPost((prev) => {
            return {
                ...prev, [id]: sanitizedValue,
            }
        })
    }

    const handleSave = async () => {

        const {data, error} = await supabase
            .from('posts')
            .update({text: editedPost.text, image_url: editedPost.image_url, video_url: editedPost.video_url})
            .eq('id', id);

        if (error) {
            console.error(error);
            return;
        }
        setPost(data[0]);
        setIsEditing(false);

        navigate(`/view-post/${data[0].id}`);
    }

    const handleCancel = () => {

        setIsEditing(false);
    }

    const deletePost = async (event) => {

        event.preventDefault();

        // const user = supabase.auth.user;

        if (!user) {
            alert('You must be logged in to delete your post.');
            return;
        }

        if (post.user_id !== user.id) {
            alert("You can only delete your own posts.");
            return;
        }

        const userResponse = window.confirm("Are you sure you want to delete this post?");

        if (userResponse) {
            const {data: deleteComments, error: deleteCommentsError} = await supabase
                .from('comments')
                .delete()
                .eq('post_id', id);
            if (deleteCommentsError) {
                console.error(deleteCommentsError);
                return;
            }

            const {data: deletePost, error: deletePostError} = await supabase
                .from('posts')
                .delete()
                .eq('id', id);
            if (deletePostError) {
                console.error(deletePostError);
                return;
            }
            navigate('/');
        }
    }

    const upvoteCount = async (event) => {

        event.preventDefault();
        await supabase
            .from('posts')
            .update({upvotes: post.upvotes + 1})
            .eq('id', id);

        setPost(prev => ({...prev, upvotes: prev.upvotes + 1}));
    }
    return (
        <div className="view-post">
            <div className="view-user-id-date" key={post.id}>
                <img src={post.avatarUrl || user_profile} alt='Avatar' style={{borderRadius: '50%'}}/>
                <p className="user-id">{post.username}</p>
                <p>{formatDistanceToNow(new Date(post.created_at))} ago</p>
                <button onClick={handleOptions}><img className="option-button" alt="edit button" src={edit}/></button>
                <div className="view-options-menu">
                    {showOptions && (
                        <div className="view-options">
                            <button onClick={handleEdit}>Edit</button>
                            <button className="delete-button" onClick={deletePost}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="view-title">
                <h2>{post.title}</h2>
            </div>

            {isEditing ? (                
                <form className="edit-form" onSubmit={handleSave}>
                    <label htmlFor="text">Text (optional)</label> <br />
                    <ReactQuill value={editedPost.text} onChange={value => handleEditing({target: {id: 'text', value}})}/> <br/>
                    {/* <textarea rows="5" cols="50" id="text" value={editedPost.text} onChange={handleEditing}></textarea> <br /> */}

                    <label htmlFor="image_url">Image URL</label> <br />
                    <input type="text" id="image_url" value={editedPost.image_url} onChange={handleEditing} /> <br />

                    <label htmlFor="video_url">Video URL</label> <br />
                    <input type="text" id="video_url" value={editedPost.video_url} onChange={handleEditing} /> <br />

                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            ) : (
                <div className="view-post-details">
                    <div className="view-post-text" dangerouslySetInnerHTML={{__html: post.text}}></div>
                    {/* <p className="view-post-text">{post.text}</p> */}
                    {post.image_url && <img className="view-post-image" src={post.image_url} />}
                    {post.video_url && renderVideo(post.video_url)}
                </div>
            )}
            <div className="view-upvote-comment">
                <button className="upvote-button" type="button" onClick={upvoteCount}><img className="upvote-img" src={upvote}/>{post.upvotes}</button>
                <p><img className="comment-count-img" src={comment_icon}/> {post.commentsCount}</p>
            </div>
            
            <div className="view-comments">
                <h3>Comment Section</h3>
                <form className="view-to-comment-cancel">
                    <textarea ref={textAreaRef} rows="1" cols="50" id="comment" placeholder="Add a comment .." onChange={(event) => {handleChange(event); adjustComment(event);}}></textarea>
                    {showCommentSubmit && (
                        <div>
                            <button type="submit" onClick={commentSubmit}>Comment</button>
                            <button className="cancel-comment" onClick={handleComment}>Cancel</button>
                        </div>
                    )}
                   
                </form>
                <br/>
                {comments && comments.length > 0 ?
                comments.map((comment, index) => (
                    <div className="each-comment" key={comment.id}>
                        <p>{comment.comment}</p>
                    </div>
                )): <div></div>}
            </div>
        </div>
    )
}

export default ViewPost