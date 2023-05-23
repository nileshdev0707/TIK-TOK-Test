import React, { useEffect, useRef, useState } from "react";
import { Card, Grid } from "@nextui-org/react";

import { GoVerified } from "react-icons/go";
import { BsCart4 } from "react-icons/bs";
import { IoIosShareAlt, IoIosSend,IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { faker } from "@faker-js/faker";
import randomWords from "random-words";

let comment_video = [];
let all_comment = [
  {name: 'Johanna32' , cmp : "Lämnade in H&M kjol S säljs nu i Sergel för 399 kr",
    userImage: faker.image.avatar()},
  {name:  "Louise", cmp: "399 kr mer till Louise för försäljning av Acne Tröja",
    userImage: faker.image.avatar()},
  {name: "Cirklara", cmp: " Sålde 10 plagg på en vecka! Grattis!",
    userImage: faker.image.avatar()},
  {name: "Jessica", cmp : " Köpte Tiger of Sweden kavaj av Johanna32",
    userImage: "https://res.cloudinary.com/drqknzm5v/image/upload/v1684205721/Avatar-PNG-Photo_nogqmi.png"},
  {name: "Sergel butiken", cmp : "  Den senaste timmen har det lämnats in 29 plagg",
    userImage: faker.image.avatar()},
  {name: "Ida_31", cmp : "  Lämnade in Acne Tröja",
    userImage: faker.image.avatar()},
  {name: "Ida_31", cmp : "  Lämnade in Acne Kavaj",
    userImage: faker.image.avatar()},
  {name: "Ida_31", cmp : "  Sålde Acne Tröja och fick 299 i kommission",
    userImage: faker.image.avatar()},
];
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const MobileVideoDetails = ({
  profileImage,
  company,
  productImage,
  username,
  videoRef,
  onVideoClick,
  sendComment,
  video,
  likePost,
  comment,
  hasLikes,
  setIsLoadVideo,
  comments,
  setComment,
  touchstart,
  touchend,
  productPrice,
  productDescription,
  productName,
  isAvailable,
  isPlaying
}) => {
  const [videoComment, setVideoComment] = useState([]);

  useEffect(() => {
    comment_video = [];
    let allComments = [];
    comments.map((comment) => {
      let singleComment = {
        userImage: all_comment[0].userImage,
        comment: all_comment[0].cmp,
        userName: all_comment[0].name,
      };
      comment_video.push(singleComment);
      allComments.push(singleComment);
    });
    setVideoComment(allComments);

    setInterval(() => {
      const rndInt = randomIntFromInterval(1, 7)
      let newComment = {
        userImage: all_comment[rndInt].userImage,
        comment: all_comment[rndInt].cmp,
        userName: all_comment[rndInt].name,
      };
      comment_video.push(newComment);
      setVideoComment(comment_video);
    }, 3000);
  }, [comments]);

  return (
    <>
    <Card
      css={{
        height: "100%",
        width:'100%',
        borderRadius:'unset',
        border: "none",
        background:
          "linear-gradient(to right, #111827, #374151)",
      }}
      id="myVideo-container"
      onTouchStart={touchstart}
      onTouchEnd={touchend}
    >
      <Card.Header
        css={{
          position: "absolute",
          zIndex: 1,
          top: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{ borderRadius: "10px", border: "1px solid gray", padding: 8 }}
          className="bg-gray-200"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <img
                alt="user-profile"
                className="rounded-full w-8 h-8"
                src={profileImage}
              />
            </div>
            <div className="ml-2">
              <div className="text-md font-bold lowercase flex gap-2 items-center justify-start">
                {username}
                <GoVerified className="text-blue-400 text-xl" />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm">{company}</p>
              </div>
            </div>
            <div className="ml-2">
              <button
                type="button"
                className="inline-block px-4 py-1.5 border border-pink-500 text-pink-500 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                Follow
              </button>
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body
        css={{
          borderRadius: 0,
          p: "0px",
          height:'100vh',
          width:'100vw'
        }}
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
          src={video}
          className="h-full cursor-pointer"
          onLoadStart={() => {
            setIsLoadVideo(true);
          }}
          onLoadedData={() => {
            setIsLoadVideo(false);
          }}
          onPlaying={() => {
            setIsLoadVideo(false);
          }}
        ></video>
        <img
          src={productImage}
          id="myImage"
          className="absolute h-full left-0 top-0 w-full z-10"
          style={{ display: "none" }}
        />
      </Card.Body>
      <Card.Footer
        css={{
          position: "absolute",
          bottom: 80,
          zIndex: 99,
        }}
      >
        <Grid.Container>
          <Grid xs={12} css={{marginBottom:14}}>
            {videoComment.length > 0 && (
              <div className="h-60 overflow-y-scroll scrollbar-thin scrollbar-hide">
                {videoComment.map((comment, index) => (
                  <div
                    key={index}
                    className="flex items-center
            space-x-2 mb-1 commet-box"
                  >
                    <img
                      className="h-7 rounded-full"
                      src={comment.userImage}
                      alt=""
                    />
                    <p className="text-sm flex-1 user-comment">
                      <span className="font-bold">{comment.userName} </span>
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Grid>
          <Grid
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexFlow: "row",
              gap: 5,
            }}
          >
            {isAvailable ? 
            (
              <p style={{background:'white',padding:12,borderRadius:10}}>Köp i butik på Sergel</p>
            ):(
              <>
              <button
                className="flex p-2 text-white rounded-xl"
                style={{ background: "#db2323" }}
                data-bs-toggle="offcanvas" 
                data-bs-target="#demo"
              >
                <BsCart4 className="text-[36px] " />
              </button>
                <p className="product-description">
                  {productDescription}
                </p>
              </>
            )
            }
            {/* <input
              type="text"
              value={comment}
              style={{ padding: 14, width: 160 }}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something.."
              className="border-none flex-1 focus:ring-0 outline-none rounded-xl bg-gray-300"
            /> */}
            {/* <div
              style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "center",
                gap: 15,
                padding: 10,
              }}
              className="rounded-xl bg-gray-300"
            >
              <IoIosSend
                className="text-black text-[30px]"
                onClick={sendComment}
              />
              {hasLikes ? (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    onClick={likePost}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 cursor-pointer text-red-500"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    onClick={likePost}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 cursor-pointer"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </motion.div>
              )}
              <IoIosShareAlt className="text-black text-[30px]" />
            </div> */}
          </Grid>
        </Grid.Container>
      </Card.Footer>
    </Card>

        <div class="offcanvas offcanvas-bottom h-75" id="demo">
          <div class="offcanvas-header">
            <h1 class="offcanvas-title"/>
            <button type="button" data-bs-dismiss="offcanvas">
                <IoIosClose
                className="text-black text-[30px]"
              />
            </button>
          </div>
          <div class="offcanvas-body">
            <img
                src={productImage}
                style={{ height:200,width:'auto',margin:'auto',borderRadius:15}}
            />
            <div style={{padding:5}}>
              <p style={{color:'gray',fontSize:25,fontWeight:'600'}}>{productName}</p>
              <p style={{fontWeight:'500'}}>{productPrice}</p>
            <h1 style={{fontWeight:'800',color:'dimgray'}}>Description</h1>
              <p>{productDescription}</p>
            </div>
            <button
              className="flex p-2 pl-10 pr-10 rounded-full text-white"
              style={{ background: "#db2323",margin:'auto' }}
            >
              Köp nu
              <BsCart4 className="ml-2 text-[18px] " />
            </button>
          </div>
        </div>
    </>
  );
};

export default MobileVideoDetails;
