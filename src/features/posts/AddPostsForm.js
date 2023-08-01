import { useState } from "react";
import { useDispatch } from "react-redux";
// import { nanoid } from "@reduxjs/toolkit"; // for generating random id
import { addNewPost } from "./postsSlice";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";

import React from "react";

const AddPostsForm = () => {
  const users = useSelector(selectAllUsers);

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        dispatch(addNewPost({ title, body: content, userId })).unwrap(); // redux toolkit adds an unwrap function to the returned promise and then that returns a new promise that either has action payload or it throws an error if its the rejected action

        setTitle("");
        setContent("");
        setUserId("");
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const allUsers = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a new Post</h2>
      <form>
        <label htmlFor="postTitle"> Post Title:</label>
        <input
          type="text"
          name="postTitle"
          id="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Select Author:</label>
        <select id="postAuthor" value={userId} onChange={onUserIdChanged}>
          <option value=""></option>
          {allUsers}
        </select>
        <label htmlFor="postContent"> Post Content:</label>
        <input
          type="text"
          name="postContent"
          id="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostsForm;
