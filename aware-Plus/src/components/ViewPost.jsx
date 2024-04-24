import React, {useState, useEffect, useRef, useCallback} from "react";
import {useParams} from "react-router-dom";
import {supabase} from '../client.js';
import edit from '../../edit.png';

const ViewPost = () => {

    const {id} = useParams();
    const [post, setPost] = useState({created_at: null, id: null, title: "", text: "", image_url: "", video_url: ""});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [editingOnOff, setEditingOnOff] = useState(false);
    const [editedPost, setEditedPost] = useState({...post});

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
            return <iframe src={embedUrl} style={{border: 'none'}} allow="autoplay; encrypted-media" allowFullScreen></iframe>;
        }
        else if (url.includes('youtu.be')) {
            const videoId = url.split('/')[3].split('?')[0];
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return <iframe src={embedUrl} style={{border: 'none'}} allow="autoplay; encrypted-media" allowFullScreen></iframe>;
        }
        else if (url.endsWith('.mp4')){
            return <video controls><source src={url} type="video/mp4"/></video>;
        }
    }

    const adjustComment = (event) => {

        if (textAreaRef.current) {
            textAreaRef.current.style.height = "inherit";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }

    const handleChange = (event) => {

        setNewComment(event.target.value);
    }

    const commentSubmit = async (event) => {

        event.preventDefault();
        const {data} = await supabase
            .from('comments')
            .insert({post_id: id, comment: newComment});
    
        setNewComment('');
        textAreaRef.current.value = "";
    } 

    // edit /update post
    const handleEdit = () => {

        setEditedPost({...post});
        setEditingOnOff(true);
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

        if (data) {
            setPost(data[0]);
            setEditingOnOff(false);
        }
        else {
            console.error(error)
        }
    }

    const handleCancel = () => {

        setEditingOnOff(false);
    }

    return (
        <div>
            {editingOnOff ? (                
                <form>
                    <p>{editedPost.created_at}</p>
                    <h2>{editedPost.title}</h2>

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
                <>
                    <p>{post.created_at}</p>
                    <h2>{post.title}</h2>
                    <p>{post.text}</p>
                    {post.image_url && <img src={post.image_url} />}
                    {post.video_url && renderVideo(post.video_url)}
                    {/* {post.video_url && <video controls><source src={post.video_url} type="video/mp4"/></video>} */}
                    <button onClick={handleEdit}>Edit <img className="moreButton" alt="edit button" src={edit}/></button>
                </>
            )}

            <div>
                <h3>Comment Section</h3>
                <form>
                    <textarea ref={textAreaRef} rows="1" cols="50" id="comment" placeholder="Add a comment .." onChange={(event) => {handleChange(event); adjustComment(event);}}></textarea>
                    <button type="submit" onClick={commentSubmit}>Submit</button>
                </form>
                <br/>
                {comments && comments.length > 0 ?
                comments.map((comment, index) => (
                    <div key={comment.id}>
                        <p>{comment.comment}</p>
                    </div>
                )): <div></div>}
            </div>
        </div>
    )
}

export default ViewPost