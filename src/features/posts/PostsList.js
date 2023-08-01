import { useSelector, useDispatch } from "react-redux";
import {
  selectAllPosts,
  getPostsError,
  getPostsStatus,
  fetchPosts,
} from "./postsSlice";
import React from "react";

import { useEffect } from "react";
import PostsExcerpt from "./PostsExcerpt";
import { useRef } from "react";

const PostsList = () => {
  const effectRan = useRef(false);
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  const dispatch = useDispatch();

  useEffect(() => {
    if (effectRan.current === false) {
      if (postsStatus === "idle") {
        dispatch(fetchPosts());
      }

      return () => {
        console.log("unmounted");
        effectRan.current = true;
      };
    }
  }, [postsStatus, dispatch]);

  let content;
  if (postsStatus === "loading") {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => (
      <PostsExcerpt key={post.id} post={post} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{postsError}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};

export default PostsList;
