import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { onSnapshot, query, collection, orderBy } from "firebase/firestore";

// import { firestore } from "../../firebase/firebase";
import VideoDetail from "./VideoDetail";
import { postList } from '../mockData';
import {useMediaQuery} from "../../hooks/useMediaQuery";

console.log(postList,'postList')

// let postList = []
let timeOut;
const DetailFeed = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const isSmallScreen = useMediaQuery(600);

  const [post, setPost] = useState('');

  // useEffect(
  //   () =>
  //     onSnapshot(
  //       query(collection(firestore, "posts"), orderBy("timestamp", "desc")),
  //       (snapshot) => {
  //         if (videoId) {
  //           postList = snapshot.docs;
  //           const pendingVideo = postList?.findIndex(
  //             (postItem) => postItem?.id === videoId
  //           );
  //           setVideoIdIndex(pendingVideo);
  //         }
  //       }
  //     ),
  //   [firestore, videoId]
  // );

  // const debounce = function (fn, d) {
  //   let timer;
  //   return function () {
  //     let context = this;
  //     let args = arguments;
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       fn.apply(context, args);
  //     }, d);
  //   }
  // }


  const [videoIdIndex, setVideoIdIndex] = useState(-1);


  useEffect(()=>{
    const pendingVideo = postList?.findIndex((postItem) => postItem?.id === videoId);
    setVideoIdIndex(pendingVideo);
  },[])

  useEffect(() => {
    if (videoIdIndex == -1) return
    setPost(postList[videoIdIndex])

    clearTimeout(timeOut)
    timeOut = null;
    if(isSmallScreen) {
      timeOut = setTimeout(() => {
        const videotag = document.getElementById('myVideo');
        videotag.addEventListener("wheel", (event) => {
          if (event.deltaY < 0) {
            if (videoIdIndex) {
              setVideoIdIndex(videoIdIndex - 1)
            }
          }
          else if (event.deltaY > 0) {
            if (videoIdIndex !== postList?.length - 1) {
              setVideoIdIndex(videoIdIndex + 1)
            }else{
              setVideoIdIndex(1);
            }
          }
        });
      }, 500);
    } else {
      // Attach the touch event handlers to your element
      const myElement = document.getElementById('myVideo');
      myElement.addEventListener('touchstart', handleTouchStart);
      myElement.addEventListener('touchend', handleTouchEnd);
      let startY = null;

      function handleTouchStart(event) {
        // Store the initial touch position
        const touch = event.touches[0];
        startY = touch.clientY;
      }

      function handleTouchEnd(event) {
        if (startY !== null) {
          // Calculate the distance between the initial and final touch positions
          const touch = event.changedTouches[0];
          const deltaY = touch.clientY - startY;

          if (deltaY > 0) {
            // User swiped downward
            console.log('Downward swipe detected!');

            if (videoIdIndex !== postList?.length - 1) {
              setVideoIdIndex(videoIdIndex + 1)
            }else{
              setVideoIdIndex(1);
            }
          } else if (deltaY < 0) {
            // User swiped upward
            console.log('Upward swipe detected!');
            if (videoIdIndex) {
              setVideoIdIndex(videoIdIndex - 1)
            }
          }

          // Reset the initial touch position
          startY = null;
        }
      }
    }
  }, [videoIdIndex])



  if (!post) return <div></div>

  return (
    <div>
      <VideoDetail
        // caption={post.data().caption}
        // company={post.data().company}
        // video={post.data().image}
        // profileImage={post.data().profileImage}
        // topic={post.data().topic}
        // timestamp={post.data().timestamp}
        // username={post.data().username}
        // userId={post.data().userId}
        // songName={post.data().songName}
        // id={post.id}
        // videoId={videoId}
        // productImage={post.data().productImage}
        caption={post.caption}
        company={post.company}
        video={post.image}
        profileImage={post.profileImage}
        topic={post.topic}
        timestamp={post.timestamp}
        username={post.username}
        userId={post.userId}
        songName={post.songName}
        id={post.id}
        videoId={videoId}
        productImage={post.productImage}
        setVideoIdIndex={setVideoIdIndex}
        videoIdIndex={videoIdIndex}
        postList={postList}
      />
    </div>
  );
};

export default DetailFeed;
