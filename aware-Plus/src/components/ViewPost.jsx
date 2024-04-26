import React, {useState, useEffect, useRef, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {supabase} from '../client.js';
import edit from '../../edit.png';

const ViewPost = () => {

    const {id} = useParams();
    const [post, setPost] = useState({created_at: null, id: null, title: "", text: "", image_url: "", video_url: ""});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({...post});
    const [showOptions, setShowOptions] = useState(false);
    const [showCommentSubmit, setShowCommentSubmit] = useState(false);

    const navigate = useNavigate();
    const textAreaRef = useRef(null);
    
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

        const fetchComments = async () => {

            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', id);

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
    } 

    // edit / update, delete post
    const handleOptions = () => {
        setShowOptions(prevShowOptions => !prevShowOptions);
    }

    const handleEdit = () => {

        setEditedPost({...post});
        setIsEditing(true);
        setShowOptions(false);
    }

    const handleEditing = (event) => {

        const {id, value} = event.target;
        setEditedPost((prev) => {
            return {
                ...prev, [id]:value,
            }
        })
    }

    const handleSave = async () => {

        const {data, error} = await supabase
            .from('posts')
            .update({text: editedPost.text, image_url: editedPost.image_url, video_url: editedPost.video_url})
            .eq('id', id);

        setPost(editedPost)
        setIsEditing(false);
    }

    const handleCancel = () => {

        setIsEditing(false);
    }

    const deletePost = async (event) => {

        event.preventDefault();
        const {data, error} = await supabase
            .from('posts')
            .delete()
            .eq('id', id);
        // window.location = '/';
        navigate('/');
    }

    return (
        <div className="view-post">
            <div className="view-user-id-date">
                <p>User ID</p>
                <span></span>
                <p>{post.created_at}</p>
                <button onClick={handleOptions}><img className="option-button" alt="edit button" src={edit}/></button>
            </div>
            <div className="view-title">
                <h2>{post.title}</h2>
            </div>
             {showOptions && (
                <div className="view-options">
                    <button onClick={handleEdit}>Edit</button>
                    <button className="delete-button" onClick={deletePost}>Delete</button>
                </div>
             )}
            {isEditing ? (                
                <form className="edit-form">
                    <label htmlFor="text">Text (optional)</label> <br />
                    <textarea rows="5" cols="50" id="text" value={editedPost.text} onChange={handleEditing}></textarea> <br />

                    <label htmlFor="image_url">Image URL</label> <br />
                    <input type="text" id="image_url" value={editedPost.image_url} onChange={handleEditing} /> <br />

                    <label htmlFor="video_url">Video URL</label> <br />
                    <input type="text" id="video_url" value={editedPost.video_url} onChange={handleEditing} /> <br />

                    <button onClick={handleSave}>Save</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            ) : (
                <div className="view-post-details">
                    <p className="view-post-text">{post.text}</p>
                    {post.image_url && <img className="view-post-image" src={post.image_url} />}
                    {post.video_url && renderVideo(post.video_url)}
                </div>
            )}

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