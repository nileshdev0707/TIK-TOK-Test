import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { faker } from "@faker-js/faker";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import MobileVideoDetails from './MobileVideoDetails';

import {
  BsFillPlayFill,
  BsReddit,
  BsPinterest,
  BsFillChatQuoteFill,
  BsCart4,
  BsFillSendFill
} from "react-icons/bs";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { IoIosShareAlt,IoIosSend } from "react-icons/io";
import { MdOutlineCancel, MdEmail } from "react-icons/md";
import { RiWhatsappLine } from "react-icons/ri";
import { AiOutlineTwitter, AiFillLinkedin } from "react-icons/ai";
import { GrFacebookOption } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";

import { auth, firestore } from "../../firebase/firebase";
import Comments from "../Comments";

const dropDwonMenuItems = [
  {
    name: "Share to Telegram",
    color: "bg-[#1DA1F2]",
    icon: <FaTelegramPlane className="text-white" />,
  },
  {
    name: "Share to Telegram",
    color: "bg-blue-700",
    icon: <AiFillLinkedin className="text-white" />,
  },
  {
    name: "Share to Reddit",
    color: "bg-orange-500",
    icon: <BsReddit className="text-white" />,
  },
  {
    name: "Share to Pinterest",
    color: "bg-red-700",
    icon: <BsPinterest className="text-white" />,
  },
  {
    name: "Share to Line",
    color: "bg-green-500",
    icon: <BsFillChatQuoteFill className="text-white" />,
  },
  {
    name: "Share to Email",
    color: "bg-[#3BB9FF]",
    icon: <MdEmail className="text-white" />,
  },
];

const userProfiles = [
  {
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    avtar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1008.jpg",
    comments: [
      {
        comment: "nice content",
        userImage:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1008.jpg",
      },
    ],
  },
  {
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    avtar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/849.jpg",
    comments: [
      {
        comment: "nice content",
        userImage:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/849.jpg",
      },
      {
        comment: "nice!",
        userImage:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/849.jpg",
      },
    ],
  },
  {
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    avtar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/88.jpg",
    comments: [
      {
        comment: "nice content",
        userImage:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/88.jpg",
      },
      {
        comment: "nice!",
        userImage:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/88.jpg",
      },
      {
        comment: "superb!",
        userImage:
          "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/88.jpg",
      },
    ],
  },
];

const VideoDetail = ({
  caption,
  company,
  videos,
  profileImage,
  topic,
  timestamp,
  username,
  userId,
  songName,
  id,
  videoId,
  productImage,
  setVideoIdIndex,
  videoIdIndex,
  postList,
  touchstart,
  touchend,
  productDescription,
  productPrice,
  productName,
  isAvailable
}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [likes, setLikes] = useState([]);
  const [hasLikes, setHasLikes] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isComOpem, setIsComOpen] = useState(true);
  const [tagCheck, setIsTagCheck] = useState();
  const [loading, setLoading] = useState(false);
  const [videoLink, setVideoLink] = useState();
  const [isCopied, setIsCopied] = useState(false);
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [isLoadVideo, setIsLoadVideo] = useState(true);

  const [userComments, setUserComments] = useState([]);

  const [activeVideoIndex,setActiveVideoIndex] = useState(0);
  const [activeImageIndex,setActiveImageIndex] = useState(0);
  const [IsImageShow,setIsImageShow] = useState(false);

  const videoRef = useRef(null);
  const isSmallScreen = useMediaQuery(600);

  useEffect(() => {
    setIsPlaying(true);
  }, [videoIdIndex]);
  const handleNextClick = () => {
    if (videoIdIndex === postList?.length - 1) {
      setVideoIdIndex(1);
    } else {
      setVideoIdIndex(videoIdIndex + 1);
    }
  };
  const handlePreviousClick = () => {
    if (videoIdIndex === 0) {
      setVideoIdIndex(postList?.length - 1);
    } else {
      setVideoIdIndex(videoIdIndex - 1);
    }
  };

  const onVideoClick = () => {
    if (isPlaying) {
      videoRef?.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef?.current?.play();
      setIsPlaying(true);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (comment) {
      setLoading(true);
      try {
        await addDoc(collection(firestore, "posts", id, "comments"), {
          comment: comment,
          username: user?.displayName,
          userImage: user?.photoURL,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Comment field is empty", {
        duration: 3000,
        position: "bottom-left",
        style: {
          background: "#fff",
          color: "#015871",
          fontWeight: "bolder",
          fontSize: "17px",
          padding: "20px",
        },
      });
    }

    setComment("");
    setLoading(false);
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(firestore, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [firestore, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(firestore, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [firestore, id]
  );

  useEffect(
    () => setHasLikes(likes.findIndex((like) => like.id === user?.uid) !== -1),
    [likes]
  );

  const likePost = async () => {
    try {
      if (hasLikes) {
        await deleteDoc(doc(firestore, "posts", id, "likes", user?.uid));
      } else {
        await setDoc(doc(firestore, "posts", id, "likes", user?.uid), {
          username: user?.displayName,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (topic) {
      const tagCheck = topic.match(/#/g);
      setIsTagCheck(tagCheck);
    }
  }, [topic]);

  useEffect(() => {
    if (videos.includes("firebasestorage.googleapis.com")) {
      const chekerUrl = video.replace(
        "firebasestorage.googleapis.com",
        "tiktokClone.com"
      );
      setVideoLink(chekerUrl);
    } else if (videos.includes("drive.google.com")) {
      const chekerUrl = videos.replace("drive.google.com", "tiktokClone.com");
      setVideoLink(chekerUrl);
    } else if (videos.includes("mega.nz/embed")) {
      const chekerUrl = videos.replace("mega.nz/embed", "tiktokClone.com");
      setVideoLink(chekerUrl);
    }
  }, [videos]);

      let videoEle = document.getElementById("myVideo");
      let imageEle = document.querySelector("#myImage");

      videoEle?.addEventListener("timeupdate", function () {
        if (videoEle.duration - videoEle.currentTime < 1) {
          // 1 second threshold
          videoEle.onend();
        }
      });

      if (videoEle) {
        videoEle.onend = function () {
          if(activeVideoIndex < videos.length - 1){
            let activeVideo = 0;
            activeVideo = (++activeVideo) % videos.length;
            videoEle.src = videos[activeVideo]
            setActiveVideoIndex(activeVideo)
          }else{
            imageEle.style.display = "block";
            setIsPlaying(false);
            setIsImageShow(true);
          }
        };
      }

      useEffect(()=> {
        let interval = '';
        if(IsImageShow){
          interval = setInterval(() => {
            if(imageEle){
              let activeImage = 0;
              if(activeImageIndex < productImage.length - 1){
                  activeImage = (++activeImage) % productImage.length;
                  imageEle.src = productImage[activeImage]
                  setActiveImageIndex(activeImage)
              }else {
                setActiveVideoIndex(0)
                setActiveImageIndex(0);
                onVideoClick();
                setIsImageShow(false);
                imageEle.style.display = "none";
              } 
            }
          }, 5000)

          return () => {
            clearInterval(interval)
          }
        }
      },[IsImageShow,activeImageIndex])

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(video[activeVideoIndex])
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleShowComments = (_id) => {
    const filter_user_comments = userProfiles?.filter(
      (user) => user.userId === _id
    );
    setUserComments(filter_user_comments);
  };

  return (
    <>
      {!isSmallScreen ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          id="myVideo-container"
          className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap"
        >
          <Toaster />
          <div className="overflow-hidden relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center bg-gradient-to-r from-gray-900 to-gray-700 main-video-container">
            <div className="opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
              <p className="cursor-pointer " onClick={() => router.back()}>
                <MdOutlineCancel className="text-white text-[35px] hover:opacity-90" />
              </p>
            </div>
            <div className="relative">
              <div
                className={`lg:h-[100vh] h-[60vh] ${isLoadVideo && "video"} `}
              >
                <video
                  preload="metadata"
                  ref={videoRef}
                  loop={isPlaying}
                  autoPlay={isPlaying}
                  muted
                  playsInline={isPlaying}
                  onClick={onVideoClick}
                  id="myVideo"
                  src={videos[activeVideoIndex]}
                  className="h-full cursor-pointer"
                  onLoadStart={() => {
                    setIsLoadVideo(true);
                  }}
                  onLoadedData={() => {
                    setIsLoadVideo(false);
                  }}
                />
                <img
                  src={productImage[activeImageIndex]}
                  id="myImage"
                  className="absolute h-full left-0 top-0 w-full z-10"
                  style={{ display: "none" }}
                />
              </div>
              <div className="absolute top-[45%] left-[40%]  cursor-pointer">
                {!isPlaying && (
                  <button onClick={onVideoClick}>
                    <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute top-[38%] lg:top-[43%] right-[0%]">
              <button onClick={handlePreviousClick}>
                <IoIosArrowDropup className="text-white text-6xl " />
              </button>
            </div>
            <div className="absolute top-[50%] right-[0%]">
              <button onClick={handleNextClick}>
                <IoIosArrowDropdown className="text-white text-6xl" />
              </button>
            </div>
            <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10  cursor-pointer">
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-white text-3xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-white text-3xl lg:text-4xl" />
                </button>
              )}
            </div>
          </div>
          <div className="relative w-[1000px] md:w-[900px] lg:w-[700px] info-container">
            <div className="lg:mt-20 mt-10">
              <>
                <div
                  className={`flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer items-center`}
                  style={{ flexFlow: `${isSmallScreen ? "row" : ""}` }}
                >
                  <img
                    alt="user-profile"
                    className="rounded-full w-12 h-12"
                    src={profileImage}
                  />
                  <div>
                    <div className="text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-start">
                      {username}{" "}
                      <GoVerified className="text-blue-400 text-xl" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="text-sm">{company}</p>
                    </div>
                  </div>
                  <div className="">
                    <button
                      type="button"
                      className="inline-block px-4 py-1.5 border border-pink-500 text-pink-500 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                    >
                      Follow
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer">
                  {userProfiles?.map((user) => (
                    <>
                      <img
                        alt="user-profile"
                        className="rounded-full w-12 h-12"
                        src={user.avtar}
                        onClick={() => handleShowComments(user.userId)}
                      />
                    </>
                  ))}
                </div>

                <div className="px-10">
                  <p className=" text-md text-gray-600">{caption}</p>
                  {tagCheck ? (
                    <p className=" text-md text-gray-600 font-bold">{topic}</p>
                  ) : (
                    <p className=" text-md text-gray-600 font-bold">
                      {"#"}
                      {topic}
                    </p>
                  )}
                </div>
                <div className="px-10 py-2.5 flex gap-4">
                  {isPlaying ? (
                    <img
                      className="w-5 h-5 animate-spin"
                      src="https://cdn2.iconfinder.com/data/icons/digital-and-internet-marketing-3-1/50/109-512.png"
                      alt="image"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                      />
                    </svg>
                  )}

                  <p className="font-semibold text-sm">{songName}</p>
                </div>
                <div className="mt-5 px-10">
                  {user && (
                    <div
                      className={`items-center mt-8 flex justify-between gap-2 lg:gap-0 ${
                        isSmallScreen ? "flex-wrap" : ""
                      }`}
                    >
                      <div className="mb-4 flex items-center">
                        {hasLikes ? (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-300 rounded-full px-2 py-2"
                          >
                            <svg
                              onClick={likePost}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 cursor-pointer text-red-500"
                            >
                              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-300 rounded-full px-2 py-2"
                          >
                            <svg
                              onClick={likePost}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 cursor-pointer"
                            >
                              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                          </motion.div>
                        )}

                        <p className="text-md font-semibold text-center ml-2">
                          {likes.length}
                        </p>
                      </div>
                      <div className="mb-4 flex items-center mr-24">
                        {isComOpem ? (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-300 rounded-full px-2 py-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 cursor-pointer text-blue-500"
                              onClick={() => setIsComOpen(false)}
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-300 rounded-full px-2 py-2"
                          >
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 cursor-pointer"
                                onClick={() => setIsComOpen(true)}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </motion.div>
                        )}

                        <p className="text-md font-semibold text-center ml-2">
                          {comments.length}
                        </p>
                      </div>
                      <div className="flex justify-end gap-1 items-center">
                        <div className="mb-4 flex items-center justify-end cursor-pointer">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-700 rounded-full px-2 py-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-white text-center"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                              />
                            </svg>
                          </motion.div>
                        </div>
                        <div className="mb-4 flex items-center justify-end cursor-pointer">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-pink-500 rounded-full px-2 py-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 text-white -rotate-45"
                            >
                              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                          </motion.div>
                        </div>
                        <div className="mb-4 flex items-center justify-end cursor-pointer">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-green-500 rounded-full px-2 py-2"
                          >
                            <RiWhatsappLine className="text-white text-[18px]" />
                          </motion.div>
                        </div>
                        <div className="mb-4 flex items-center justify-end cursor-pointer">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-blue-500 rounded-full px-2 py-2"
                          >
                            <GrFacebookOption className="text-white text-[18px]" />
                          </motion.div>
                        </div>
                        <div className="mb-4 flex items-center justify-end cursor-pointer">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-[#1DA1F2] rounded-full px-2 py-2"
                          >
                            <AiOutlineTwitter className="text-white text-[18px]" />
                          </motion.div>
                        </div>
                        <div
                          className="mb-4 flex items-center justify-end cursor-pointer"
                          onMouseEnter={() => setIsOpenDrop(true)}
                          onMouseLeave={() => setIsOpenDrop(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-transparent hover:bg-gray-300 rounded-full px-2 py-2"
                          >
                            <IoIosShareAlt className="text-black text-[18px]" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}
                  {isOpenDrop && (
                    <div
                      className="flex justify-end"
                      onMouseEnter={() => setIsOpenDrop(true)}
                      onMouseLeave={() => setIsOpenDrop(false)}
                    >
                      <div className="z-10 absolute w-auto bg-white rounded divide-y divide-gray-100 shadow top-[260px] lg:top-[300px]">
                        <ul
                          className="pb-2 text-sm text-gray-700"
                          aria-labelledby="dropdownDefault"
                        >
                          {dropDwonMenuItems.map((menu, index) => (
                            <li key={index}>
                              <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex justify-start items-center gap-4 px-4 text-black font-medium cursor-pointer"
                              >
                                <div
                                  className={`${menu.color} rounded-full px-1.5 py-1.5`}
                                >
                                  {menu.icon}
                                </div>
                                {menu.name}
                              </motion.div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-100 px-2 py-2.5 rounded-md mt-4 flex">
                    <input
                      type="text"
                      readOnly
                      value={videoLink ? videoLink : videos[activeVideoIndex]}
                      className="w-full bg-transparent outline-none cursor-pointer text-gray-500 text-sm"
                    />
                    {isCopied ? (
                      <button className="text-xs text-center font-bold w-28 cursor-not-allowed">
                        Coppid!
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-xs text-center cursor-pointer font-bold w-28"
                        onClick={handleCopyClick}
                      >
                        Coppy Link
                      </motion.button>
                    )}
                  </div>
                </div>
                <div className="flex justify-center mt-4 ">
                  <button
                    className="flex p-2 pl-10 pr-10 rounded-full text-white"
                    style={{ background: "#db2323" }}
                  >
                    Köp nu
                    <BsCart4 className="ml-2 text-[18px] " />
                  </button>
                </div>
              </>
              {isComOpem && (
                <div className="items-center pt-4" id={id}>
                  <Comments
                    comment={comment}
                    setComment={setComment}
                    sendComment={sendComment}
                    comments={comments}
                    loading={loading}
                    ownShow={true}
                    userComments={userComments}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <MobileVideoDetails
          profileImage={profileImage}
          company={company}
          productImage={productImage[activeImageIndex]}
          username={username}
          videoRef={videoRef}
          onVideoClick={onVideoClick}
          sendComment={sendComment}
          video={videos[activeVideoIndex]}
          likePost={likePost}
          comment={comment}
          hasLikes={hasLikes}
          setIsLoadVideo={setIsLoadVideo}
          comments={comments}
          setComment={setComment}
          touchstart={touchstart}
          touchend={touchend}
          productDescription={productDescription}
          productPrice={productPrice}
          productName={productName}
          isAvailable={isAvailable}
          isPlaying={isPlaying}
        />
      )}
    </>
  );
};

export default VideoDetail;
