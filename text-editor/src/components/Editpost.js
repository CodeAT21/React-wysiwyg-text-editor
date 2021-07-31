import React,{useState} from 'react';
import { EditorState, convertToRaw, ContentState,convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { useHistory } from "react-router-dom";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';

function Editpost(props) {
  let history = useHistory();
  const [userInfo, setuserInfo] = useState({
    title: props.postList[0].title,
  });
  const onChangeValue = (e) => {
    setuserInfo({
      ...userInfo,
      [e.target.name]:e.target.value
    });
  } 
  let editorState = EditorState.createWithContent(
  ContentState.createFromBlockArray(
    convertFromHTML(props.postList[0].description)
  ));
  const [description, setDescription] = useState(editorState);

  const onEditorStateChange = (editorState) => {
    setDescription(editorState);
  }

  const [isError, setError] = useState(null);
  const PoemAddbooks = async (event) => {
    try {
      event.preventDefault();
      event.persist();
      if(userInfo.description.value.length < 50){
        setError('Required, Add description Minimum length 50 characters');
        return;
      }
      axios.post(`http://localhost:8080/editArticle`, {
        title: userInfo.title,
        description: userInfo.description.value,
        ids:props.editPostID
      })
      .then(res => { // then print response status
        if(res.data.success === true){
          history.push('/');
        }
      })
    } catch (error) { throw error;}    
  }
return (
<div className="App">
  <div className="container">
    <div className="row"> 
      <form onSubmit={PoemAddbooks} className="update__forms">
        <h3 className="myaccount-content"> Edit   </h3>
        <div className="form-row">
          <div className="form-group col-md-12">
            <label className="font-weight-bold"> Title <span className="required"> * </span> </label>
            <input type="text" name="title" value={userInfo.title} onChange={onChangeValue}  className="form-control" placeholder="Title" required />
          </div>
          <div className="form-group col-md-12 editor">
            <label className="font-weight-bold"> Description <span className="required"> * </span> </label>
            <Editor
              editorState={description}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />
            <textarea style={{display:'none'}} disabled ref={(val) => userInfo.description = val} value={draftToHtml(convertToRaw(description.getCurrentContent())) } />
          </div>
          {isError !== null && <div className="errors"> {isError} </div>}
          <div className="form-group col-sm-12 text-right">
            <button type="submit" className="btn btn__theme"> Submit  </button>
          </div> 
        </div>
      </form>
    </div>
  </div>
</div>
)
}
export default Editpost
