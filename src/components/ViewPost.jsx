import React, {useState, useEffect, useRef, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {supabase} from '../client.js';
import {formatDistanceToNow} from "date-fns";
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import DOMpurify from 'dompurify';

const ViewPost = () => {
    // post and new/comments
    const {id} = useParams();
    const [post, setPost] = useState({created_at: null, id: null, title: "", text: "", image_url: "", video_url: "", upvotes: 0, user_id: null, username: ""});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    // edit usestates
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedPost, setEditedPost] = useState({...post});
    const [showOptions, setShowOptions] = useState(false);
    const [showCommentSubmit, setShowCommentSubmit] = useState(false);
    // user auth for verification to edit / delete post
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const textAreaRef = useRef(null);
    // fetching post and its comments
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
        // event listener when new comment is made,
        // so it displays new comment right away
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

    // fetching user auth data
    useEffect(() => {

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        fetchUser();
    }, [])
    // rendering posts video file dependent on url / type
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
        const username = user.email.split('@')[0];
        const {data} = await supabase
            .from('comments')
            .insert({post_id: id, comment: newComment, user_id: user.id, username: username});
    
        setNewComment('');
        textAreaRef.current.value = "";
        setShowCommentSubmit(prev => !prev);

        setPost(prev => ({...prev, commentsCount: prev.commentsCount + 1}));
    } 

    // edit / update, delete post
    const handleOptions = () => {
        setShowOptions(prevShowOptions => !prevShowOptions);
    }
    // users can only edit delete their own posts / authentication
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
    // saving and displaying edit
    // adding useeffect + editedpost + issaving dependency,
    // or else the handleEditing is too slow and doesnt save new edit
    useEffect(() => {

        const savePost = async () => {

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
        if (isSaving) {
            savePost();
            setIsSaving(false);
        }
    }, [editedPost, isSaving])

    const handleSave = () => {
        setIsSaving(true);
    }

    // cancelling an edit
    const handleCancel = () => {
        setIsEditing(false);
    }
    // users may only delete their own posts / authentication
    const deletePost = async (event) => {

        event.preventDefault();
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
    // updating and displaying current upvote count
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
                <img src={post.avatarUrl || '/user-profile.png'} alt='Avatar' style={{borderRadius: '50%'}}/>
                <p className="user-id">{post.username}</p>
                <p>{formatDistanceToNow(new Date(post.created_at))} ago</p>
                <button onClick={handleOptions}><img className="option-button" alt="edit button" src='/edit.png'/></button>
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
                    {post.image_url && <img className="view-post-image" src={post.image_url} />}
                    {post.video_url && renderVideo(post.video_url)}
                </div>
            )}
            <div className="view-upvote-comment">
                <button className="upvote-button" type="button" onClick={upvoteCount}><img className="upvote-img" src='/upvote.png'/>{post.upvotes}</button>
                <p><img className="comment-count-img" src='/comment-icon.png'/> {post.commentsCount}</p>
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
                        <img src={post.avatarUrl || '/user-profile.png'} /> {comment.username} • {formatDistanceToNow(new Date(comment.created_at))} ago
                        <p>{comment.comment}</p>
                    </div>
                )): <div></div>}
            </div>
        </div>
    )
}

export default ViewPost