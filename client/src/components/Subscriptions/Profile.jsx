/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DropZone from 'react-dropzone';
import request from 'superagent';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '48%',
    position: 'absolute',
    top: '25%',
    marginRight: '-50px',
    marginLeft: '40px',
    borderRadius: '20px',
  },
  space: {
    marginBottom: 15,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    image: '', show: '', description: '', id: '',
  });

  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const URL = process.env.CLOUDINARY_UPLOAD_URL;

  useEffect(() => {
    return axios.get('/user')
      .then(({ data }) => {
        setValues({ ...values,
          image: data.image ? data.image : null,
          show: data.favShow ? data.favShow : 'Share your favorite show!',
          description: data.description ? data.description : 'Say a little about yourself!',
          id: data._id ? data._id : null });
      })
      .catch((err) => console.warn(err));
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    setOpen(false);
    axios.put('user/profile', {
      show: values.show,
      description: values.description,
      id: values.id,
      image: values.image,
    });
  };

  const handleImage = (file) => {
    const upload = request.post(URL)
      .field('upload_preset', preset)
      .field('file', file);
    upload.end((err, response) => {
      if (err) {
        return err;
      }
      if (response.body.secure_url !== '') {
        setValues({ ...values, image: response.body.secure_url });
        axios.put('user/profile', {
          show: values.show,
          description: values.description,
          id: values.id,
          image: response.body.secure_url,
        });
      }
    });
  };

  const onImageDrop = (files) => {
    handleImage(files[0]);
  };

  const classes = useStyles();

  return (
    <div>
      <Card className={classes.root}>
        <CardActionArea>
          <DropZone
            onDrop={onImageDrop}
            accept="image/*"
            multiple={false}
          >
            { ({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
              >
                <div>
                  <input {...getInputProps()} />
                  <p style={{ cursor: 'pointer', textAlign: 'center' }}>Drop an image or click to select a file to upload</p>
                </div>
                <div>
                  <div>
                    <img style={{ height: '600px', width: '100%', objectFit: 'cover' }} src={values.image} alt="https://www.uoh.cl/assets/img/no_img.jpg" />
                  </div>
                </div>
              </div>
            )}
          </DropZone>
          <CardContent>
            <Typography
              variant="caption"
              color="textSecondary"
              component="p"
              style={{ fontWeight: 'fontWeightBold', fontSize: 25, color: '#000000' }}
            >
              My current favorite show:
            </Typography>
            <Typography
              className={classes.space}
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ fontSize: 20, color: '#3588C8' }}
            >
              { values.show }
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              component="p"
              style={{ fontWeight: 'fontWeightBold', fontSize: 25, color: '#000000' }}
            >
              About Me:
            </Typography>
            <Typography
              className={classes.space}
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ fontSize: 25, color: '#3588C8' }}
            >
              { values.description }
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={() => setOpen(true)}>
            Edit Profile
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="show"
                label="current favorite show"
                type="text"
                fullWidth
                onChange={handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="about me"
                type="text"
                fullWidth
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Submit Changes
              </Button>
            </DialogActions>
          </Dialog>
        </CardActions>
      </Card>
    </div>
  );
}
