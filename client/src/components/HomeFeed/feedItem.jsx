/* eslint-disable no-console */
import React, { useState } from 'react';
import axios from 'axios';
import htmlParser from 'react-html-parser';
import './homefeed.css';
import { FaHeart, FaRegCommentDots, FaTimes, FaGift } from 'react-icons/fa';
import ReactGiphySearchbox from 'react-giphy-searchbox';
import Reply from './reply.jsx';

const FeedItem = ({ post, user = {}, setPosts, isDrawer }) => {
  const [show, setShow] = useState();
  const [name, setName] = useState();
  const [like, setLike] = useState();
  const [currentPost, setPost] = useState(post);
  console.log(currentPost);
  const [number, setNumber] = useState(currentPost.likes.length);
  const [box, setBox] = useState(false);
  const [content, setContent] = useState('');
  const [gifView, setgifView] = useState(false);

  const getShow = () => {
    if (!show) {
      axios(`/postShow/${currentPost.show}`).then(({ data }) => {
        setShow(data.name);
      });
    }
  };

  const getName = () => {
    if (!name) {
      axios.get(`/postUser/${currentPost.user}`).then(({ data }) => {
        setName(data.name);
      });
    }
  };

  const getLike = () => {
    if (like === undefined) {
      setLike(currentPost.likes.includes(user.id));
    }
  };

  const gifPost = (gif, id) => {
    setgifView(false);
    const obj = {
      url: gif.images.original.url,
      feed: id._id,
    };

    axios.get('/replys/gif', { params: obj })
      .then(({ data }) => {
        setPost(data);
        axios.get('/posts').then((result) => {
          setPosts(result.data);
        });
      });
  };

  return (
    <div>
      <div className="main-post-container">
        {getShow()}
        {getName()}
        {getLike()}
        <h2 className="post-show">{`${show}`}</h2>
        <div id="post-show-title">{`${currentPost.title}` || null}</div>
        <h4 className="post-author">{`${name}`}</h4>
        <div id="post-content">
          {
        currentPost.content.includes('</') ? (htmlParser(currentPost.content)) : currentPost.content
        }
        </div>
        <div className="post-btn-container">
          <div className="like-count">{number || null}</div>
          <FaHeart
            className={like ? 'liked-button' : 'post-like-btn'}
            onClick={() => {
              axios.get(`/liked/${currentPost._id}`).then(() => {
                if (like) {
                  setNumber(number - 1);
                } else {
                  setNumber(number + 1);
                }
                setLike(!like);
              });
            }}
          >
            {like ? 'unlike' : 'like'}
          </FaHeart>
          {!box && (
            <FaRegCommentDots
              className="comment-btn"
              onClick={() => setBox(true)}
            />
          )}

          {!gifView && (
            <FaGift
              className="gif-button"
              onClick={() => setgifView(true)}
            />
          )}
        </div>

        <div className="post-comment-btn">
          {gifView && (
            <div className="comment-box">
              <FaTimes
                className="gif-x-btn"
                onClick={() => {
                  setgifView(false);
                }}
              />
              <ReactGiphySearchbox
                apiKey={process.env.GIPHY}
                onSelect={(item) => { gifPost(item, currentPost); }}
              />
            </div>
          )}
        </div>

        <div className="post-comment-btn">
          {box && (
            <div className="comment-box">
              <input
                className="comment-txt-box"
                placeholder="what are your thoughts?"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              <button
                className="submit-post-comment-btn"
                onClick={() => {
                  setBox(false);
                  axios
                    .get(`/replys/${currentPost._id}/${content}`)
                    .then(({ data }) => {
                      setContent('');
                      setPost(data);
                      axios.get('/posts').then((result) => {
                        setPosts(result.data);
                      });
                    });
                }}
              >
                submit
              </button>
              <FaTimes
                className="x-btn"
                onClick={() => {
                  setBox(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div>
        {isDrawer && currentPost.comment.map((value, i) => {
          return (
            <Reply
              className="reply"
              key={value + i}
              id={value}
              place={75}
              user={user}
              setPosts={setPosts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeedItem;
