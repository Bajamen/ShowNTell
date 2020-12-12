import React, { useState } from 'react';
import clsx from 'clsx';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import FeedItem from './feedItem.jsx';

import './homefeed.css';

const HomeFeed = ({ posts, handleUserClick, user, setPosts }) => {
  const [selectPost, setSelectPost] = useState(null);
  const [isOpen, setisOpen] = useState(false);

  const useStyles = makeStyles((theme) => ({
    hide: {
      display: 'none',
    },
    drawer: {
      width: 200,
      flexShrink: 0,
      backgroundColor: '#140e3e',
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: '100%',
      backgroundColor: '#140e3e',
      whiteSpace: 'nowrap',
    },
    Feed: {
      padding: '20px',
    },
  }));

  const classes = useStyles();

  return (
    <div>
      <div className="home-title"> Home feed</div>
      <div className="home-feed-container">
        {posts
          ? posts.map((post, i) => {
            return (
              <div>
                <FeedItem
                  handleUserClick={handleUserClick}
                  post={post}
                  setPosts={setPosts}
                  key={post + i}
                  user={user}
                  isDrawer={false}
                />
                <Button
                  style={{ backgroundColor: '#1d3b61', color: 'white' }}
                  onClick={() => {
                    setisOpen(true);
                    setSelectPost(post);
                  }}
                >
                  View Replies
                </Button>
              </div>
            );
          })
          : null}
      </div>
      <div className="drawer-container">
        <SwipeableDrawer
          anchor="right"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: isOpen,
            }),
          }}
          open={isOpen}
          onClose={() => { setisOpen(false); }}
        >
          {
            selectPost && (
              <div>
                <FeedItem
                  handleUserClick={handleUserClick}
                  post={selectPost}
                  setPosts={setPosts}
                  key={Math.random()}
                  user={user}
                  isDrawer
                />
              </div>
            )
          }
        </SwipeableDrawer>
      </div>
    </div>
  );
};

export default HomeFeed;
