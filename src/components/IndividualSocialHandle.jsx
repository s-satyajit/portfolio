import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa"; // Importing icons
import { TbBrandX } from "react-icons/tb"; // X logo (using Tabler Icons)

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { socialHandles } from "../constants";

const ProfileCard = ({ platform, url, api, staticData }) => {
  const [profileData, setProfileData] = useState(staticData || null);

  useEffect(() => {
    if (api) {
      // Fetch data from API
      fetch(api)
        .then((response) => response.json())
        .then((data) =>
          setProfileData({
            name: data.name || "User",
            profilePicture: data.avatar_url,
            bio: data.bio || "No bio available.",
          })
        )
        .catch((error) => console.error(`Error fetching ${platform} data:`, error));
    }
  }, [api, platform]);

  if (!profileData) {
    return <p>{platform} profile not available.</p>;
  }

  const platformDetails = {
    GitHub: {
      color: "bg-gray-800",
      icon: <FaGithub size={24} color="#ffffff" />,
    },
    LinkedIn: {
      color: "bg-blue-700",
      icon: <FaLinkedin size={24} color="#ffffff" />,
    },
    X: {
      color: "bg-black",
      icon: <TbBrandX size={24} color="#ffffff" />,
    },
  };

  const { color, icon } = platformDetails[platform];

  return (
    <motion.div className="flex w-full xs:w-[320px] bg-black-200 rounded-3xl overflow-hidden shadow-lg">
      {/* Stylish outer layer */}
      <div className={`${color} flex flex-col justify-center items-center p-3`}>
        {icon}
        <p className="text-white text-sm font-semibold mt-2">{platform}</p>
      </div>

      {/* Main card */}
      <div className="flex-1 p-5 text-center flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <img
            src={profileData.profilePicture}
            alt={`${platform} Profile`}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h3 className="text-white font-bold text-lg mb-2">{profileData.name}</h3>
          <p className="text-secondary font-medium text-sm mb-4">{profileData.bio}</p>
        </div>

        {/* Button always at the bottom */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md self-center"
        >
          Visit Profile
        </a>
      </div>
    </motion.div>
  );
};

const IndividualSocialHandle = () => {
  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}>
        <motion.div>
          <p className={styles.sectionSubText}>Connect with me on</p>
          <h2 className={styles.sectionHeadText}>My Social Handles</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {socialHandles.map((handle) => (
          <ProfileCard
            key={handle.platform}
            platform={handle.platform}
            url={handle.url}
            api={handle.api}
            staticData={handle.static}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(IndividualSocialHandle, "");
