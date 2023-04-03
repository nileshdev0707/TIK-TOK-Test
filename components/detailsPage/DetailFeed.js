import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

import { firestore } from "../../firebase/firebase";
import VideoDetail from "./VideoDetail";

const DetailFeed = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(firestore, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          if (videoId) {
            const _posts = snapshot.docs;
            const selectedVideo = _posts?.filter(
              (postItem) => postItem?.id === videoId
            );
            const pendingVideo = _posts?.filter(
              (postItem) => postItem?.id !== videoId
            );
            const filterVideo = [...selectedVideo, ...pendingVideo];
            setPosts(filterVideo);
          } else {
            setPosts(snapshot.docs);
          }
        }
      ),
    [firestore, videoId]
  );
  /*   console.log(posts); */

  return (
    <div>
      {posts.map((post) => (
        <VideoDetail
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
          videoId={videoId}
          productImage={post.data().productImage}
        />
      ))}
    </div>
  );
};

export default DetailFeed;
