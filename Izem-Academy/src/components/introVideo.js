import introVideo from "../assets/intro.mp4";

const IntroVideo = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <video 
        className="w-full sm:max-w-[400px] h-auto object-cover"
        src={introVideo} 
        autoPlay 
        loop 
        muted 
        controls 
      />
    </div>
  );
};

export default IntroVideo;
