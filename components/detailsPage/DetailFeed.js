import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

import { firestore } from "../../firebase/firebase";
import VideoDetail from "./VideoDetail";

let postList = []
let timeOut;
const DetailFeed = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const [videoIdIndex, setVideoIdIndex] = useState(-1);
  const [post, setPost] = useState('');

  useEffect(
    () =>
      onSnapshot(
        query(collection(firestore, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          if (videoId) {
            postList = snapshot.docs;
            const pendingVideo = postList?.findIndex(
              (postItem) => postItem?.id === videoId
            );
            setVideoIdIndex(pendingVideo);
          }
        }
      ),
    [firestore, videoId]
  );

  useEffect(() => {

    if (videoIdIndex == -1) return
    setPost(postList[videoIdIndex])
    window.addEventListener("wheel", (event) => {
      // clearTimeout(timeOut)
      // timeOut = null;
      // timeOut = setTimeout(() => {

      // }, 1000)
      if (event.deltaY < 0) {
        if (videoIdIndex) {
          setVideoIdIndex(videoIdIndex - 1)
        }
      }
      else if (event.deltaY > 0) {
        if (videoIdIndex !== postList?.length - 1) {
          setVideoIdIndex(videoIdIndex + 1)
        }
      }

    });
  }, [videoIdIndex])



  if (!post) return <div></div>

  return (
    <div>
      <VideoDetail
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
        setVideoIdIndex={setVideoIdIndex}
        videoIdIndex={videoIdIndex}
        postList={postList}
      />
    </div>
  );
};

export default DetailFeed;
