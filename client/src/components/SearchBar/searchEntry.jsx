/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import './search.css';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import Rating from '@material-ui/lab/Rating';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import noImgAvail from './no_img_avail.png';

const StyledRating = withStyles({
  iconFilled: {
    color: '#dd3e42',
  },
})(Rating);

const ValidationTextField = withStyles({
  root: {
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      padding: '4px !important',
    },
  },
})(TextField);

const labels = {
  0.5: 'The Worst!',
  1: 'Terrible',
  1.5: 'Poor',
  2: 'A Waste',
  2.5: 'Really Bad',
  3: 'Ok',
  3.5: 'Good',
  4: 'Great',
  4.5: 'Excellent',
  5: 'Perfect!',
};

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5vw',
  },
  margin: {
    margin: theme.spacing(1),
  },
});
const SearchFeedEntry = ({ show, onClick }) => {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const classes = useStyles();
  const [state, setState] = useState('');
  const [showPopUp, setShowPopUp] = useState({});
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState('');

  const getRating = () => {
    const theShows = comments.filter((comment) => comment.name === show.name);
    axios.get('/user').then(({ data: { id } }) => {
      const finalComment = theShows.length && theShows[0].rating.filter((comment) => comment.hasOwnProperty(id));
      setValue(finalComment[0] ? finalComment[0][id] : value);
    });
    return value;
  };
  const handleChange = (event) => {
    setText(event.target.value);
  };

  const getShows = async () => {
    const { data } = await axios.get('/shows');
    setComments(data);
  };
  useEffect(() => {
    getRating();
    getShows();
  }, []);

  const getSummary = () => {
    let summary = show.summary.replace(/<p>|<\/p>/g, '');
    const output = [];
    while (summary.length > 0) {
      if (summary.search(/<i>/) !== -1) {
        output.push(summary.slice(0, summary.search(/<i>/)));
        summary = summary.slice(summary.search(/<i>/) + 3);

        const italic = summary.slice(0, summary.search(/<\/i/));
        output.push(<i key={italic + summary.search(/<i>/)}>{italic}</i>);
        summary = summary.slice(summary.search(/<\/i>/) + 4);
      } else if (summary.search(/<b>/) !== -1) {
        output.push(summary.slice(0, summary.search(/<b>/)));
        summary = summary.slice(summary.search(/<b>/) + 3);

        const bold = summary.slice(0, summary.search(/<\/b/));
        output.push(<b key={bold + summary.search(/<b>/)}>{bold}</b>);
        summary = summary.slice(summary.search(/<\/b>/) + 4);
      } else {
        output.push(summary);
        summary = '';
      }
    }

    return output;
  };

  const getImage = () => {
    if (show.image !== null) {
      return show.image.medium;
    }
  };

  const commentClick = async () => {
    const theShows = comments.filter((comment) => comment.name === show.name);
    const { data: { id } } = await axios.get('/user');
    const finalComment = theShows[0].comment.filter((comment) => comment.hasOwnProperty(id));
    setShowComments(finalComment[0][id]);
  };

  const handleClick = async () => {
    setShowPopUp({});
    const { data: { id } } = await axios.get('/user');
    await axios.put('/show', { idUser: id, idShow: show.id, comment: text, rating: value });
  };

  const getPicUnavail = () => {
    if (show.image === null) {
      return noImgAvail;
    }
  };

  return (
    <div className="show-card">
      <div className="show-name">
        <div className="show-name">{show.name}</div>
        { show.rating && show.rating.average ? (
          <>
            <Typography component="legend">Average Rating</Typography>
            <StyledRating
              name="customized-color"
              value={show.rating.average / 2}
              getLabelText={(value) => `${value} Tv${value !== 1 ? 's' : ''}`}
              precision={0.1}
              readOnly
              icon={<LiveTvIcon fontSize="inherit" />}
            />
          </>
        ) : <Typography component="legend">Average Rating N/A</Typography> }
        <>
          <Typography component="legend">Your Rating</Typography>
          <div className={classes.root}>
            <Rating
              name={show.name}
              value={getRating() !== 0 ? getRating() : value}
              readOnly={!!value}
              precision={0.5}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              onClick={() => setShowPopUp({ [show.id]: true })}
            />
            { value !== null && <Typography ml={2}>{ labels[hover !== -1 ? hover : value] }</Typography> }
          </div>

        </>
        <br />
        { showPopUp[show.id] && (
          <form>
            <div style={{ margin: 'auto', width: '10vw', borderRadius: '20px', backgroundColor: 'white', paddingBottom: '5px' }}>
              <ValidationTextField
                className={classes.margin}
                multiline
                label="comments"
                rowsMax={4}
                required
                variant="filled"
                value={text}
                id="validation-outlined-input"
                onChange={handleChange}

              />
              <br />

              <Button
                onClick={handleClick}
                variant="contained"
                color="primary"
                href="#contained-buttons"
              >

                Submit
              </Button>
            </div>
          </form>
        ) }
        <img className="show-img" src={getImage()} alt="" value={show.id} onClick={() => onClick(show)} />
        <img className="unavail-img" src={getPicUnavail()} alt="" />
        <button
          className="summary-button"
          onClick={(event) => {
            event.stopPropagation();
            setState(getSummary());
          }}
        >
          show summary
        </button>
        <div className="show-summary">
          {state}
        </div>
        <button onClick={commentClick}>
          Show comments
        </button>
        <div>
          {showComments}
        </div>
      </div>
    </div>
  );
};

export default SearchFeedEntry;
