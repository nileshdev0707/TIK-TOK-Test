import React, { useEffect, useState } from "react";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

import { firestore } from "../firebase/firebase";
import Post from "./Post";
import { postList } from './mockData';

import Skeleton from "./Skeleton/Skeleton";

const RightHandSide = () => {
  const [posts, setPosts] = useState([]);
  const [isShow, setIsShow] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        query(collection(firestore, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [firestore]
  );

  useEffect(() => {
    setTimeout(() => {
      if (posts) {
        setIsShow(true);
      } else return;
    }, 3000);
  }, [posts]);

  return (
    <div className="right mt-4">
      {isShow ? (
        <>
          {/* {posts.map((post) => (
            <Post
              key={post.id}
              caption={post.data().caption}
              company={post.data().company}
              video={post.data().image}
              profileImage={post.data().profileImage}
              topic={post.data().topic}
              timestamp={post.data().timestamp}
              username={post.data().username}
              userId={post.data().userId}
              songName={post.data().songName}
              id={post.id}
            />
          ))} */}

          {postList.map((post) => (
            <Post
              key={post.id}
              caption={post.caption}
              company={post.company}
              video={post.video[0]}
              profileImage={post.profileImage}
              topic={post.topic}
              timestamp={post.timestamp}
              username={post.username}
              userId={post.userId}
              songName={post.songName}
              id={post.id}
            />
          ))}
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default RightHandSide;
