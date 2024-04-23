import React, {useState, useEffect, useRef, useCallback} from "react";
import {useParams} from "react-router-dom";
import {supabase} from '../client.js';

const ViewPost = () => {

    const {id} = useParams();
    const [post, setPost] = useState({created_at: null, id: null, title: "", text: "", image_url: "", video_url: ""});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const textAreaRef = useRef(null);

    // const fetchComments = useCallback(async () => {

    //     const {data} = await supabase
    //         .from('comments')
    //         .select('*')
    //         .eq('post_id', id);
        
    //     if (data){
    //         console.log(data);
    //         setComments(data);
    //     } 
    // }, [id, supabase])

    // const fetchComments = async () => {

    //     const { data } = await supabase
    //         .from('comments')
    //         .select('*')
    //         .eq('post_id', id);

    //     if (data) {
    //         console.log(data);
    //         setComments(data);
    //     }
    // }

    // const fetchComments = async () => {
    //     const { data } = await supabase
    //         .from('comments')
    //         .select('*');
    
    //     if (data) {
    //         const filteredComments = data.filter(comment => comment.post_id === id);
    //         setComments(filteredComments);
    //     }
    // }
    
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




        // const subscription = supabase
        //     .from('comments')
        //     .on('*', payload => {
        //         fetchComments();
        //     })
        //     .subscribe();

        // // Unsubscribe when the component is unmounted
        // return () => {
        //     supabase.removeSubscription(subscription);
        // }
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

    // const fetchCommentsRef = useRef(fetchComments);
    // fetchCommentsRef.current = fetchComments;

    const commentSubmit = async (event) => {

        //event.preventDefault();
        const {data} = await supabase
        .from('comments')
        .insert({post_id: id, comment: newComment});
    
        // if (data) {
        //     //setComments([]);
        //     // wait for insert op to complete before fetching comments
        //     setTimeout(fetchComments, 1000);
        // }
        setNewComment('');
        textAreaRef.current.value = "";
    } 

    return (
        <div>
            <p>{post.created_at}</p>
            <h2>{post.title}</h2>
            <p>{post.text}</p>
            {post.image_url && <img src={post.image_url}/>}
            {post.video_url && renderVideo(post.video_url)}
            {/* {post.video_url && <video controls><source src={post.video_url} type="video/mp4"/></video>} */}
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